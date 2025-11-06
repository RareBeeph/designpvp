FROM node:24

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .

RUN npm run build
CMD npm run start -p 3000
