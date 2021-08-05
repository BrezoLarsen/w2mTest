FROM nginx:stable-alpine

#copy nginx custom conf
ADD ./conf/ /etc/nginx/

#Clear nginx directory
RUN rm -rf /usr/share/nginx/html

# Copy the statics
ADD ./dist/w2mTest /usr/share/nginx/html

# Exposing port
EXPOSE 80
