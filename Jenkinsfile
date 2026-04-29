pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/pavansai2608/lab27.git'
            }
        }

        stage('Build & Run Containers') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up --build -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo '✅ lab27 deployed successfully!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}