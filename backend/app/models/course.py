from dataclasses import dataclass, field, asdict
from typing import Literal
from pathlib import Path
import os

VIDEO_EXTENSIONS = {'.mp4', '.mkv', '.mov', '.avi', '.webm'}


@dataclass
class TreeNode:
    name: str
    relative_path: str
    type: Literal["directory", "video"]
    children: list["TreeNode"] = field(default_factory=list)

    def get_full_path(self, root_path: str) -> str:
        base = Path(root_path)
        if self.relative_path:
            return str(base / self.relative_path)
        return str(base)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "relative_path": self.relative_path,
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
            name=data["tree"]["name"],
            relative_path=data["tree"].get("relative_path", ""),
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
                name=child_data["name"],
                relative_path=child_data.get("relative_path", ""),
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


def scan_folder(root_path: Path, relative_to: str = "") -> TreeNode:
    if relative_to == "":
        relative_to = "."
    
    if root_path.is_file():
        return TreeNode(
            name=root_path.name,
            relative_path=root_path.name,
            type="video"
        )
    
    children = []
    for item in sorted(root_path.iterdir()):
        if item.is_dir():
            rel_name = item.name if relative_to == "." else f"{relative_to}/{item.name}"
            child = scan_folder(item, rel_name)
            if _has_videos(child):
                children.append(child)
        elif item.suffix.lower() in VIDEO_EXTENSIONS:
            rel_name = item.name if relative_to == "." else f"{relative_to}/{item.name}"
            children.append(TreeNode(
                name=item.name,
                relative_path=rel_name,
                type="video"
            ))
    
    return TreeNode(
        name=root_path.name,
        relative_path=relative_to,
        type="directory",
        children=children
    )