function copyToClipboard(elementId, button) {
    // Get the text field
    const textToCopy = document.getElementById(elementId).innerText;

    // Use the modern Navigator Clipboard API
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Provide feedback to the user
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = '#2dce89'; // a success green

        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = 'var(--primary-blue)';
        }, 2000); // Revert back after 2 seconds
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback or error message could be implemented here
    });
}