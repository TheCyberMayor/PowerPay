# DigitalOcean CLI Commands to Set Environment Variables
# Run these commands after installing doctl and authenticating
# Get your APP_ID from: doctl apps list

export APP_ID="your-app-id-here"

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: JWT_SECRET
    value: "9vuhrEwZMWnNz0pNLaw8Y9xvV6ZiPyTEK_OqUBn7Qe6moAQezc5HDjLmBU0qzCydrhKzdKOiIKviyH6O3oR1EQ"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: ENCRYPTION_KEY
    value: "dc0bc429c1e3bdfd92092af8b51b57b1f023adad256f5b08987da24ff1557b19"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: WEBHOOK_SECRET
    value: "4xREJRAOJQrqsiyrNfProtGBbgLVlb5fueUKZc1ecYM"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: FLUTTERWAVE_WEBHOOK_HASH
    value: "your-webhook-hash-from-flutterwave"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: DATABASE_SSL
    value: "true"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: DATABASE_URL
    value: "postgresql://placeholder-will-be-set-by-digitalocean"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: NODE_ENV
    value: "production"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: PORT
    value: "3000"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: FRONTEND_URL
    value: "https://powerpay.ng"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: ADMIN_URL
    value: "https://admin.powerpay.ng"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: QUEUES_ENABLED
    value: "false"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: RATE_LIMIT_ENABLED
    value: "true"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: LOGGING_LEVEL
    value: "info"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: HEALTH_CHECK_ENABLED
    value: "true"
EOF
)

doctl apps update $APP_ID --spec <(cat <<EOF
name: powerpay
services:
- name: api
  envs:
  - key: METRICS_ENABLED
    value: "true"
EOF
)

# For Flutterwave keys, set them manually in the DigitalOcean dashboard
# as they contain sensitive information that shouldn't be in command history