import { openDB } from "idb";
import type { CameraRotation } from "../type/VRdata";

// bikin koneksi ke IndexedDB
export const dbPromise = openDB("VRSessionDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("chunks")) {
      // "chunks" adalah nama object store untuk menyimpan array rotasi kamera
      db.createObjectStore("chunks", { keyPath: "id", autoIncrement: true });
    }
  },
});

// simpan array rotasi kamera ke IndexedDB
export async function saveChunk(rotation: CameraRotation[]) {
  const db = await dbPromise;
  await db.add("chunks", { data: rotation });
}

// ambil rotasi chunks rotasi dari IndexedDB
export async function getAllChunks(): Promise<
  {
    id: number;
    data: CameraRotation[];
  }[]
> {
  const db = await dbPromise;
  return db.getAll("chunks");
}

// hapus rotasi chunks rotasi dari IndexedDB
export async function deleteAllChunks() {
  const db = await dbPromise;
  await db.clear("chunks");
}
