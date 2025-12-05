# Deployment Guide for AWS EC2 (t3.micro)

## Prerequisites
- AWS EC2 instance (Amazon Linux 2023 or Amazon Linux 2)
- Docker and Docker Compose installed
- Domain name (optional but recommended)

## Step 1: Prepare EC2 Instance

### Connect to your instance
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

### Install Docker
```bash
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
```

### Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Log out and back in for group changes to take effect
```bash
exit
# SSH back in
```

## Step 2: Clone Repository

```bash
git clone https://github.com/your-username/dukem-learning.git
cd dukem-learning
```

## Step 3: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit with your actual values
nano .env
```

**Important:** Change these values:
- `MONGO_ROOT_PASSWORD`: Use a strong password
- `JWT_SECRET`: Generate a strong random string
- `GEMINI_API_KEY`: Your Google GenAI API key

## Step 4: Update Frontend API URL

Edit `frontend/src/utils/apiPaths.ts`:
```typescript
export const BASE_URL = import.meta.env.VITE_API_URL || "http://YOUR_EC2_IP/api";
```

Or create `frontend/.env`:
```
VITE_API_URL=http://YOUR_EC2_IP/api
```

## Step 5: Build and Deploy

```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Step 6: Configure Security Group

In AWS Console, ensure your EC2 security group allows:
- Port 22 (SSH) - Your IP only
- Port 80 (HTTP) - 0.0.0.0/0
- Port 443 (HTTPS) - 0.0.0.0/0 (if using SSL)

## Step 7: Access Application

Open your browser and navigate to:
- Frontend: `http://YOUR_EC2_IP`
- Backend API: `http://YOUR_EC2_IP/api`

## Cost Optimization Tips

### 1. **Use Swap Space** (Important for t3.micro with 1GB RAM)
```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. **Limit Docker Resources**
Add to `docker-compose.yml` for each service:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 256M
```

### 3. **Enable Docker Log Rotation**
```bash
sudo nano /etc/docker/daemon.json
```
Add:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```
Restart Docker:
```bash
sudo systemctl restart docker
```

### 4. **Use CloudWatch for Monitoring**
Set up AWS CloudWatch alarms for:
- CPU utilization
- Memory usage
- Disk space

## Maintenance Commands

```bash
# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f [service_name]

# Update application
git pull
docker-compose up -d --build

# Clean up unused images/containers
docker system prune -a
```

## Backup MongoDB

```bash
# Backup
docker exec dukem-mongodb mongodump --archive=/backup.archive --db=dukem-learning

# Copy to host
docker cp dukem-mongodb:/backup.archive ./mongodb-backup-$(date +%Y%m%d).archive

# Restore
docker cp mongodb-backup.archive dukem-mongodb:/backup.archive
docker exec dukem-mongodb mongorestore --archive=/backup.archive
```

## SSL/HTTPS Setup (Optional)

### Using Let's Encrypt with Certbot
```bash
# Install certbot
sudo yum install certbot -y

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.conf to use SSL
# Add volume mount in docker-compose.yml for certificates
```

## Troubleshooting

### Out of Memory Issues
```bash
# Check memory usage
free -h
docker stats

# Restart services if needed
docker-compose restart
```

### Container won't start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### MongoDB connection issues
```bash
# Check if MongoDB is healthy
docker-compose ps
docker exec dukem-mongodb mongosh --eval "db.adminCommand('ping')"
```

## Monitoring

```bash
# Install htop for system monitoring
sudo yum install htop -y
htop

# Monitor Docker containers
watch docker stats
```
