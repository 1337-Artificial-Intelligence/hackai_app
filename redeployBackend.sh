cd /home/imran_baali19/thinkai_main
git add . && git commit -m "redeploy"
git pull

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /home/imran_baali19/thinkai_main/backend
# npm i && npm run build
npm i
pm2 reload hackai_backend
