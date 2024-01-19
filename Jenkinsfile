#!/usr/bin/env groovy
@Library('infobip-nodejs-pipeline-library') _
import com.infobip.iskra.web.pipeline.PackageJson
import static com.infobip.iskra.web.pipeline.Constants.*

// provides Build with parameters screen
properties([
    [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false],
    parameters([choice(
        choices: '-----\npatch\nminor\nmajor',
        description: 'If chosen, performs release and publishes to Artifactory (NPM).',
        name: 'RELEASE'
    )])
])
loadNodejsSteps(this)
node('infobip-docker-nodejs:v16-dev') {

    stage('Clone') {
        checkout scm
    }

    stage('Configure Workspace') {
        configureWorkspace()
    }

    def SONAR_PROJECT_NAME = "infobip-homepage-web"
    def BRANCH_NAME_TO_BUILD = env.BRANCH_NAME

    def pkg = new PackageJson(this, 'package.json')
    def releaseType = env.RELEASE
    def isSnapshot = (releaseType == null || releaseType == '-----')
    def appS3Name = pkg.getApplicationPrefix()
    def currentVersion = pkg.currentVersion
    def isMasterRelease = env.BRANCH_NAME == 'master' && !isSnapshot

    stage('Resolve current version') {
        if (!isSnapshot) {
            sh "npm version ${releaseType}"
            currentVersion = pkg.currentVersion
        }
        currentBuild.displayName = "${currentVersion}"
        currentBuild.description = "infobip-homepage-web:${currentVersion}"
    }

    stage('Install') {
        installDependencies()
    }

    stage('Localize') {
        localizeModule()
    }

    stage('Generate code snippets') {
        if (isMasterRelease) {
            sh "npm run update:code-snippets"
        }
    }

    stage('SonarQube') {
        def scannerHome = tool 'sonar-qube-scaner-4.5.0.2216';
        withSonarQubeEnv('ci-sonar-7.1') {
            sh """
                ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=$SONAR_PROJECT_NAME \
                    -Dsonar.host.url=$SONAR_HOST_URL \
                    -Dsonar.login=$SONAR_AUTH_TOKEN \
                    -Dsonar.branch.name=$BRANCH_NAME_TO_BUILD \
                    -Dsonar.python.version=3.8
            """
        }
    }

    stage('Run Snyk') {
        snykSecurity(severity: 'critical', snykInstallation: 'Snyk', snykTokenId: 'Snyk-Jenkins', failOnIssues: false)
    }

    stage('Build') {
        build('--production', currentVersion)
    }

    parallel 'CDN': {
        stage('Publish to CDN') {
            publishToCdn(appS3Name, currentVersion)
        }
    }, 'Minify': {
        stage('Minify') {
            minifyNpmModule()
            sh 'mkdir docker_context'
            sh "tar -cf docker_context/application.tar node_modules client config constants etc i18n log middlewares public routes services utils views .dockerignore app.js config.js global.d.ts nodemon.json package-lock.json package.json server.js start.sh"
            sh 'cp Dockerfile docker_context/'
            sh 'rm -rf node_modules'
        }
    }

    def app
    stage('Build image') {
        environment {
            NODE_ENV = 'production'
        }
        docker.withRegistry(DOCKER_URL, DOCKER_CREDENTIALS_ID) {
            app = docker.build(
                "docker.ib-ci.com/${pkg.applicationName}",
                "./docker_context"
            )
        }
    }

    // if (isMasterRelease) {
        stage('Push image') {
            docker.withRegistry(DOCKER_URL, DOCKER_CREDENTIALS_ID) {
                app.push(buildDockerLabel(currentVersion, env.BRANCH_NAME))
                app.push("latest")
            }
        }
    // }

    if (!isSnapshot) {
        stage('Increment version') {
            def next_version = generateNextVersion('patch', currentVersion)
            createNewSnapshotVersion(next_version, env.BRANCH_NAME)
        }
    }
}