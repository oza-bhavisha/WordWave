provider "google" {
  project     = "csci-5408-new"
  region      = "us-east1"
}

resource "google_container_cluster" "my_clust" {
  name     = "gke-1"
  location = "us-east1-b"

  initial_node_count = 3

  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 10
  }
  
}