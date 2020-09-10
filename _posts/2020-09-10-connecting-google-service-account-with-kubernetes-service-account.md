---
layout: post
title: Connecting Google Service Account with Kubernetes Service Account
date: 2020-09-10 14:52 +0000
description: 
tags: ["Kubernetes"]
image:
  path: "/assets/social-devops-python-preview.png"
  width: 1200
  height: 628
twitter:
  card: summary_large_image
---
## 3 ways to access a Google Cloud Resource:
 
Your containers and Pods might need access to other resources in Google Cloud. There are three ways to do this.

Below is a part extracted from the [Google Docs](https://cloud.google.com/kubernetes-engine/docs/concepts/security-overview#giving_pods_access_to_resources): 


> ### **Workload Identity (recommended)**
> 
> The simplest and most secure way to authorize Pods to access Google Cloud resources is with [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). Workload identity allows a Kubernetes service account to run as a [Google Cloud service account](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity). Pods that run as the Kubernetes service account have the permissions of the Google Cloud service account.
> 
> Workload Identity can be used with [GKE Sandbox](https://cloud.google.com/kubernetes-engine/docs/how-to/sandbox-pods).
> 
> ### **Node Service Account**
> 
> Your Pods can also authenticate to Google Cloud using the Kubernetes clusters' [service account](https://cloud.google.com/compute/docs/access/service-accounts) credentials from metadata. However, these credentials can be reached by any Pod running in the cluster if Workload Identity is not enabled. Create and configure a custom service account that has the [minimum IAM roles](https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster#use_least_privilege_sa) that are required by all the Pods running in the cluster.
> 
> This approach is not compatible with [GKE Sandbox](https://cloud.google.com/kubernetes-engine/docs/how-to/sandbox-pods) because GKE Sandbox blocks access to the metadata server.
> 
> ### **Service Account JSON key**
> 
> A third way to grant credentials for Google Cloud resources to applications is to manually use the [service account's key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys). This approach is strongly discouraged because of the difficulty of securely managing account keys.
> 
> You should use [application-specific Google Cloud service accounts to provide credentials](https://cloud.google.com/kubernetes-engine/docs/tutorials/authenticating-to-cloud-platform) so that applications have the minimal necessary permissions. Each service account is assigned only the IAM roles that are needed for its paired application to operate successfully. Keeping the service account application-specific makes it easier to revoke its access in the case of a compromise without affecting other applications. Once you have assigned your service account the correct IAM roles, you can create a JSON service account key, and then mount that into your Pod using a Kubernetes [Secret](https://cloud.google.com/kubernetes-engine/docs/concepts/secret).


## Connecting Google service account with Kubernetes service account

This requires Workload identity to work.

# Pre-requisites:

1. Google service account with roles required by the application. 

### Conditions:

1. The cluster MUST have workload identity enabled
2. The node pool's `workload-metadata` MUST be set as `GKE_METADATA` instead of `GCE_METADATA`.
3. A binding between the GSA(Google service account) and KSA(Kubernetes service account) MUST exist

## Enable workload identity in the GKE cluster

Source: [Workload Identity \| Kubernetes Engine Documentation \| Google Cloud](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)

### **New Cluster:**

```bash
PROJECT_ID=jadia-project
CLUSTER_NAME=ptdevops

gcloud container clusters create $CLUSTER_NAME \
  --release-channel regular \
  --workload-pool=$PROJECT.svc.id.goog
```

### **Existing cluster**:

```bash
PROJECT_ID=jadia-project
CLUSTER_NAME=playops

gcloud container clusters update $CLUSTER_NAME \
  --workload-pool=$PROJECT_ID.svc.id.goog
```

Source: [https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#enable_on_existing_cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#enable_on_existing_cluster)

or you can go and edit the cluster from web interface and enable *workload identity*.

**Enable workload identity in the node-pool:**

Do this to all the node pools in the cluster

```bash
CLUSTER_NAME=playops
NODE_POOL_NAME=standard-pool-1

gcloud container node-pools update $NODE_POOL_NAME \
  --cluster=$CLUSTER_NAME \
  --workload-metadata=GKE_METADATA
```

source: [https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#option_1_node_pool_modification](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#option_1_node_pool_modification)

### Create a binding between the GSA and KSA

- Create a GSA with the required roles.
- Create KSA  with annotation about the GSA

```bash
NAMESPACE=default
GCLOUD_SERVICE_ACCOUNT_NAME=test-gsa
PROJECT_NAME=playops
KUBE_SERVICE_ACCOUNT_NAME=k8s-service-account

kubectl annotate serviceaccount \
  --namespace $NAMESPACE \
    $KUBE_SERVICE_ACCOUNT_NAME \
    iam.gke.io/gcp-service-account=$GCLOUD_SERVICE_ACCOUNT_NAME@$PROJECT_NAME.iam.gserviceaccount.com
```

or just add annotation as:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    iam.gke.io/gcp-service-account: test-gsa@playops.iam.gserviceaccount.com
  name: k8s-service-account
```

- Create binding 

```bash
NAMESPACE=default
KSA=k8s-service-account
PROJECT_NAME=playops
GSA=test-gsa@$NAMESPACE.iam.gserviceaccount.com

gcloud iam service-accounts add-iam-policy-binding \ 
--role roles/iam.workloadIdentityUser \
--member "serviceAccount:$PROJECT_NAME.svc.id.goog[$NAMESPACE/$KSA]" $GSA
```

### Test if workload identity is working or not

```bash
kubectl run -it --rm --image google/cloud-sdk:slim \
--serviceaccount k8s-service-account \
--namespace default workload-identity-test
```

```bash
# Inside the pod
gcloud auth list

#OUTPUT>
#root@workload-identity-test:/# gcloud auth list
#              Credentialed Accounts
#ACTIVE  ACCOUNT
#*       test-gsa@playops.iam.gserviceaccount.com
```

## References

1. [Dinesh, Sandeep. “Updating Google Kubernetes Engine VM Scopes with Zero Downtime.” Medium. Last modified February 6, 2018. Accessed September 10, 2020.](https://medium.com/google-cloud/updating-google-container-engine-vm-scopes-with-zero-downtime-50bff87e5f80)

2. [“Enabling GKE Workload Identity - DZone Cloud.” Dzone.Com. Accessed September 10, 2020](https://dzone.com/articles/enabling-gke-workload-identity)

3. [“Node Management in GKE (Cloud Next ’19) - YouTube.” Accessed September 10, 2020](https://www.youtube.com/watch?v=2HmDZXbfA80)
