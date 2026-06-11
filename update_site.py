import os

OLD_SNIPPET = """<script>
    let siteBasePath;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
        siteBasePath = '/';
    } else {
        siteBasePath = '/'; // Your GitHub repository name
    }
    console.log("Global siteBasePath dynamically set to:", siteBasePath);
</script>"""

NEW_SNIPPET = """<script>
    let siteBasePath;

    if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:'
    ) {
        siteBasePath = '/';
    } else {
        siteBasePath = '/';
    }
</script>"""

ROOT_DIR = "."

for root, _, files in os.walk(ROOT_DIR):
    for file in files:
        if file.endswith((".html", ".htm")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            if OLD_SNIPPET in content:
                content = content.replace(OLD_SNIPPET, NEW_SNIPPET)
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated: {path}")
