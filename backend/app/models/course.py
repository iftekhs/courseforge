from dataclasses import dataclass, field
from typing import Literal
from pathlib import Path
import uuid

VIDEO_EXTENSIONS = {'.mp4', '.mkv', '.mov', '.avi', '.webm'}


@dataclass
class TreeNode:
    id: str
    name: str
    path: str
    type: Literal["directory", "video"]
    children: list["TreeNode"] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "type": self.type,
            "children": [c.to_dict() for c in self.children]
        }


class Course:
    def __init__(self, id: str, name: str, root_path: str, created_at: str, tree: TreeNode):
        self.id = id
        self.name = name
        self.root_path = root_path
        self.created_at = created_at
        self.tree = tree

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "root_path": self.root_path,
            "created_at": self.created_at,
            "tree": self.tree.to_dict()
        }

    @staticmethod
    def from_dict(data: dict) -> "Course":
        tree = TreeNode(
            id=data["tree"].get("id", str(uuid.uuid4())),
            name=data["tree"]["name"],
            path=data["tree"].get("path", ""),
            type=data["tree"]["type"],
            children=[]
        )
        Course._hydrate_tree(tree, data["tree"]["children"])
        return Course(
            id=data["id"],
            name=data["name"],
            root_path=data["root_path"],
            created_at=data["created_at"],
            tree=tree
        )

    @staticmethod
    def _hydrate_tree(parent: TreeNode, children_data: list):
        for child_data in children_data:
            child = TreeNode(
                id=child_data.get("id", str(uuid.uuid4())),
                name=child_data["name"],
                path=child_data.get("path", ""),
                type=child_data["type"]
            )
            parent.children.append(child)
            if child_data.get("children"):
                Course._hydrate_tree(child, child_data["children"])


def _count_videos(tree: TreeNode) -> int:
    if tree.type == "video":
        return 1
    return sum(_count_videos(c) for c in tree.children)


def _has_videos(tree: TreeNode) -> bool:
    if tree.type == "video":
        return True
    return any(_has_videos(c) for c in tree.children)


def scan_folder(root_path: Path) -> TreeNode:
    root_str = str(root_path.resolve())
    node_id = hash(root_str)  # Stable ID based on path

    if root_path.is_file():
        return TreeNode(
            id=str(node_id),
            name=root_path.name,
            path=root_str,
            type="video"
        )

    children = []
    for item in sorted(root_path.iterdir()):
        item_str = str(item.resolve())
        if item.is_dir():
            child = scan_folder(item)
            if _has_videos(child):
                children.append(child)
        elif item.suffix.lower() in VIDEO_EXTENSIONS:
            children.append(TreeNode(
                id=str(hash(item_str)),
                name=item.name,
                path=item_str,
                type="video"
            ))

    return TreeNode(
        id=node_id,
        name=root_path.name,
        path=root_str,
        type="directory",
        children=children
    )