param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing
$drawingAssembly = [System.Drawing.Bitmap].Assembly.Location
$gdiAssembly = Join-Path $PSHOME 'System.Private.Windows.GdiPlus.dll'
$windowsCoreAssembly = Join-Path $PSHOME 'System.Private.Windows.Core.dll'
$drawingPrimitivesAssembly = [System.Drawing.Rectangle].Assembly.Location
Add-Type -ReferencedAssemblies $drawingAssembly, $drawingPrimitivesAssembly, $gdiAssembly, $windowsCoreAssembly -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class LingunoChromaKey {
    public static void Convert(string inputPath, string outputPath) {
        using (var source = new Bitmap(inputPath))
        using (var output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
            using (var graphics = Graphics.FromImage(output)) graphics.DrawImageUnscaled(source, 0, 0);
            var rect = new Rectangle(0, 0, output.Width, output.Height);
            var data = output.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            var bytes = Math.Abs(data.Stride) * data.Height;
            var pixels = new byte[bytes];
            Marshal.Copy(data.Scan0, pixels, 0, bytes);

            for (var y = 0; y < output.Height; y++) {
                for (var x = 0; x < output.Width; x++) {
                    var i = y * data.Stride + x * 4;
                    var b = pixels[i];
                    var g = pixels[i + 1];
                    var r = pixels[i + 2];
                    var magentaSignal = ((int)r + b) / 2 - g;
                    if (r > 120 && b > 120 && magentaSignal > 50 && Math.Abs(r - b) < 100) {
                        pixels[i + 3] = 0;
                    }
                }
            }

            Marshal.Copy(pixels, 0, data.Scan0, bytes);
            output.UnlockBits(data);
            output.Save(outputPath, ImageFormat.Png);
        }
    }
}
'@

$source = (Resolve-Path -LiteralPath $InputPath).Path
$destination = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputPath))
[LingunoChromaKey]::Convert($source, $destination)
