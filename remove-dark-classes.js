const fs = require('fs');
const path = require('path');

const srcPath = path.join(process.cwd(), 'src');

function removeDarkClasses(content) {
    // Remove all dark: classes
    return content
        .replace(/\s+dark:[\w-]+/g, '') // Remove dark: classes
        .replace(/dark:[\w-]+\s+/g, '') // Remove dark: classes
        .replace(/dark:[\w-]+/g, '') // Remove remaining dark: classes
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) {
            console.log(`Processing: ${fullPath}`);
            const content = fs.readFileSync(fullPath, 'utf-8');
            const newContent = removeDarkClasses(content);

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf-8');
                console.log(`  ✓ Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(srcPath);
console.log('\n✅ All dark: classes removed!');
