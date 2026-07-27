# `next build` needs several devDependencies - typescript to transpile
# next.config.ts, the @types/* packages, and babel-plugin-react-compiler - so this
# stage installs everything. Only the build output crosses into the runtime stage.
FROM node:24 AS builder

WORKDIR /code

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# next.config.ts sets output: "standalone", which emits server.js plus a pruned
# node_modules holding only what the server actually imports. Nothing to install
# here, and no dev dependencies come along.
FROM node:24-slim AS runner

WORKDIR /code

ENV NODE_ENV=production
# server.js reads these; without HOSTNAME it binds to localhost only and the
# container is unreachable.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# standalone deliberately excludes both of these, so copy them in by hand.
COPY --from=builder /code/public ./public
COPY --from=builder /code/.next/static ./.next/static

COPY --from=builder /code/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]
