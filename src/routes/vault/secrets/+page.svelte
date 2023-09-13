<script>
  import { TreeView, FoldersView } from "$lib/components";
  import { fade } from "svelte/transition";
  import {
    treeStore,
    navigationHistory,
    expandedNodes,
    selectedNodeChildren,
    breadCrumbs,
    currentParentNode,
  } from "$lib/store/ui";
  import { createSecretDrawerSettings } from "$lib/util/drawerSettings";
  import { BreadCrumbs, SecretsCard } from "$lib/components";
  import { findNodeById, findParentNodesById } from "$lib/util";
  import Icon from "@iconify/svelte";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  const drawerStore = getDrawerStore();
  const tree = {
    id: 1,
    label: "VAULT",
    children: [
      {
        id: 2,
        parentId: 1,
        label: "UAT",
        children: [
          { id: 3, parentId: 2, label: "DB" },
          {
            id: 4,
            label: "USERNAMES",
            parentId: 2,
            children: [
              { id: 6, parentId: 4, label: "Admin" },
              { id: 8, parentId: 4, label: "corporate-admin" },
              { id: 7, parentId: 4, label: "spenders" },
            ],
          },
          { id: 5, parentId: 2, label: "KAFKA" },
        ],
      },
      {
        parentId: 1,
        id: 9,
        label: "STAGE",
        children: [
          { id: 10, parentId: 9, label: "DB" },
          { id: 11, parentId: 9, label: "USER NAMES" },
          { id: 12, parentId: 9, label: "KAFKA" },
        ],
      },
    ],
  };
  treeStore.set(tree);
  const goBack = () => {
    navigationHistory.update((history) => {
      // Remove the last node from the history
      const lastNode = history.pop();
      if (lastNode) {
        const node = findNodeById($treeStore, lastNode.parentId);
        const parents = findParentNodesById($treeStore, lastNode.parentId);
        currentParentNode.set(node.id);
        expandedNodes.update((nodes) => {
          nodes.add(lastNode.id);
          return new Set(nodes);
        });
        breadCrumbs.set(parents);

        // Update the selectedNodeChildren based on the parent of the lastNode

        selectedNodeChildren.set(node.children || []);
      }

      return history;
    });
  };
  const createSecret = async () => {
    drawerStore.open(createSecretDrawerSettings);
  };
</script>

<div class="bread-crumbs-container flex items-center ml-4">
  <button
    type="button"
    class="btn-icon btn-icon-sm variant-filled-tertiary m-4"
    on:click={goBack}
  >
    <Icon icon="ep:back" />
  </button>
  <div class="flex-box card-hover variant-outline-tertiary rounded-md p-1">
    <BreadCrumbs />
  </div>
</div>
<input
  type="search"
  class="rounded-2xl variant-filled-surface ml-14"
  placeholder="search..."
/>

<button class="btn variant-filled-secondary" on:click={createSecret}
  >Add Secret</button
>
<div class="app-container flex">
  <!-- TreeView on the left -->
  <div
    class="min-w-[250px] max-w-sm h-screen card-hover variant-ringed-tertiary rounded-xl shadow-md p-8 ml-16"
  >
    <TreeView nodeId={$treeStore.id} />
  </div>

  <!-- FoldersView on the right -->
  <div class="flex flex-col flex-grow">
    <div class="folders-area flex-grow">
      <FoldersView />
      <SecretsCard />
    </div>
  </div>
</div>