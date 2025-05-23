cd /home/imran_baali19/thinkai_main_2
git add . && git commit -m "redeploy"
git pull

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /home/imran_baali19/thinkai_main_2/frontend
npm i && npm run build
sudo rm -rf /usr/share/caddy/hackai-frontend-2
sudo mv dist /usr/share/caddy/hackai-frontend-2

cd /home/imran_baali19/thinkai_main_2/backend
# npm i && npm run build
npm i
pm2 reload hackai_backend_2
