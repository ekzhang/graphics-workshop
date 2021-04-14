# Tool to convert a 3D mesh in Wavefront OBJ format to JSON

import json
import trimesh
import typer


def main(file: str):
    mesh = trimesh.load(file)
    with open(f"{file}.json", "w") as out:
        json.dump(
            {
                "vertices": mesh.vertices.tolist(),
                "elements": mesh.faces.tolist(),
                "normals": mesh.vertex_normals.tolist(),
            },
            out,
        )


if __name__ == "__main__":
    typer.run(main)
