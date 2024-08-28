# 🛠️ **State Machine Builder**

![React](https://img.shields.io/badge/React-v17.0.2-blue?logo=react)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue?logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitLab-orange?logo=gitlab)
![AKS](https://img.shields.io/badge/Deployment-Azure%20Kubernetes%20Service-blue?logo=microsoft-azure)

**State Machine Builder** is an interactive web application that enables users to create, visualize, and manage state machines. With an intuitive drag-and-drop interface, YAML file generation, parsing capabilities, and advanced visualization algorithms, this tool enhances the workflow for the OM team and improves state machine management.

## 🌟 **Features**

- **Drag-and-Drop Interface**: Seamlessly create state machines with an easy-to-use drag-and-drop UI.
- **YAML File Generation and Parsing**: Export configurations to YAML and recreate state machines from complex YAML files.
- **Enhanced Visualization**: Automatically optimizes the layout of nodes and transitions for clear and structured views.
- **Testing**: Robust unit and integration tests using Jest and Cypress ensure application stability and performance.
- **CI/CD and Deployment**: Automated pipelines with GitLab CI, Docker for containerization, and deployment on Azure Kubernetes Service (AKS).

## 📑 **Table of Contents**

- [Technologies Used](#-technologies-used)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Running Tests](#-running-tests)
- [Containerization](#-containerization)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment-on-azure-kubernetes-service-aks)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 💻 **Technologies Used**

- **Frontend**: [ReactJS](https://reactjs.org/) – Building the interactive UI.
- **Testing**: [Jest](https://jestjs.io/) & [Cypress](https://www.cypress.io/) – Unit and integration tests.
- **Containerization**: [Docker](https://www.docker.com/) – Packaging the application.
- **CI/CD**: [GitLab CI](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/) – Automating testing, building, and deployment.
- **Cloud Deployment**: [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/) – Orchestrating and scaling application deployment.

## 🚀 **Getting Started**

To get a local copy up and running, follow these simple steps:

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v14+): [Download Node.js](https://nodejs.org/)
- **Docker**: [Download Docker](https://www.docker.com/products/docker-desktop/)
- **Azure CLI**: [Download Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Git**: [Download Git](https://git-scm.com/)

### **Installation**

1. **Clone the Repository**

    ```bash
    git clone https://github.com/ramirachdi/state-machine-builder.git
    cd state-machine-builder
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Run the Application**

    ```bash
    npm start
    ```

    Visit `http://localhost:3000` in your browser to access the application.

## 🧪 **Running Tests**

- **Run Unit Tests with Jest**

    ```bash
    npm run test
    ```

- **Run Integration Tests with Cypress**

    ```bash
    npm run cypress:open
    ```

## 🐳 **Containerization**

The application is fully containerized using Docker. Follow these steps to build and run the container:

1. **Build the Docker Image**

    ```bash
    docker build -t state-machine-builder .
    ```

2. **Run the Docker Container**

    ```bash
    docker run -p 3000:3000 state-machine-builder
    ```

    Access the application at `http://localhost:3000`.

## 🔄 **CI/CD Pipeline**

The project uses GitLab CI to automate the development lifecycle:

- **Code Linting**: Automated checks for code quality.
- **Testing**: Runs Jest and Cypress tests during the pipeline.
- **Building Docker Images**: Automates the Docker build process.
- **Deployment**: Pushes the application to Azure Kubernetes Service (AKS).

## ☁️ **Deployment on Azure Kubernetes Service (AKS)**

1. **Login to Azure**

    ```bash
    az login
    ```

2. **Deploy the Application**

    Use the provided Kubernetes configuration file to deploy the application:

    ```bash
    kubectl apply -f k8s/deployment.yaml
    ```

3. **Access the Application**

    The application will be accessible via the load balancer IP provided by AKS.

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## 📜 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
