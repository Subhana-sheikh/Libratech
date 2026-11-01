const { execSync } = require('child_process');

console.log('\n🚀 Starting GitHub Push for Libratech...\n');

try {
  // 1. Stage all changes
  execSync('git add -A', { stdio: 'inherit' });

  // 2. Check if there are changes to commit
  const status = execSync('git status --porcelain').toString().trim();
  if (status) {
    console.log('📦 Committing recent updates...');
    execSync('git commit -m "Update Libratech project"', { stdio: 'inherit' });
  } else {
    console.log('✅ Local tree is clean, proceeding to push...');
  }

  // 3. Push to GitHub
  console.log('🌐 Pushing to origin main...');
  execSync('git push -u origin main', { stdio: 'inherit' });
  console.log('\n🎉 Successfully pushed to GitHub!\n');
} catch (error) {
  console.error('\n⚠️ Push encountered an issue:\n', error.message);
  console.log('Tip: If GitHub has a README already, run: git push -u origin main --force');
}

