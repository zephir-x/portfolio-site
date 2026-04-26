FROM nginx:alpine

# We copy the custom configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# We copy the website files to the folder served by Nginx
COPY ./public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]