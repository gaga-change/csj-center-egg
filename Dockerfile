FROM node:10-alpine as csj-center-egg-build
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ./page/package.json .
RUN npm --registry https://registry.npm.taobao.org install --production --silent
COPY ./page .
RUN npm run build
FROM node:10-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package.json .
# RUN npm --registry https://registry.npm.taobao.org install --production --silent && mv node_modules ../
RUN npm --registry https://registry.npm.taobao.org install --production --silent
COPY . .
COPY --from=csj-center-egg-build /usr/src/app/dist ./page/dist
RUN ls ./page
RUN ls ./page/dist
EXPOSE 80
CMD npm start