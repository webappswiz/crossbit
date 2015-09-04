# This .sh file will be sourced before starting your application.
# You can use it to put environment variables you want accessible
# to the server side of your app by using process.env.MY_VAR
#
# Example:
# export MONGO_URL="mongodb://localhost:27017/myapp-development"
# export ROOT_URL="http://localhost:3000"

export LC_ALL="en_US.UTF-8"

export APP_NAME="CrossBit"

# export ROOT_URL="http://crossbit.webappsconsult.com:80"
export ROOT_URL="http://crossbit.webappsconsult.com"
export PORT=80

# Remote DB:
# export MONGO_URL=""
# Management:
# https://app.compose.io

# SMTP settings
# export MAIL_URL="smtp://postmaster%40uducate.me:f8c788ce72a32b778f13b11e757ff50d@smtp.mailgun.org:587/"
# Management:
# https://mailgun.com/cp

export BUNDLE_PATH = "/opt/CrossBit/app/"
