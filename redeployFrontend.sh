cd /home/imran_baali19/thinkai_main
git add . && git commit -m "redeploy"
git pull

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /home/imran_baali19/thinkai_main/frontend
npm i && npm run build
sudo rm -rf /usr/share/caddy/hackai-frontend
sudo mv dist /usr/share/caddy/hackai-frontend
