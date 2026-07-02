FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Generate Prisma Client (if needed)
# RUN bunx prisma generate

# [OPTIONAL] run tests & build
ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json .

# Copy prisma schema if you need it at runtime
# COPY --from=prerelease /usr/src/app/prisma ./prisma
# COPY --from=prerelease /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# run the app
USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "src/index.ts"]
