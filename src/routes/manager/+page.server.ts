import { error } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { readdirSync, statSync, existsSync } from "fs";
import { resolve } from "path";
import { list as getDriveList } from "drivelist";

export interface ManagerData {
    path: string;
    childDirectoryPaths: string[];
}

export const load = (async function load({ url }) {
    // 获取path字段，可以为null或者空字符串
    const path = url.searchParams.get("path") || "";

    // 如果没有path字段，则返回所有盘符
    // 如果path字段有内容，则返回path路径下的所有项目（path指向目录目录）
    if (path && existsSync(path)) {
        const filter = (subPath: string) => {
            try {
                return statSync(resolve(path, subPath)).isDirectory();
            } catch (e) {
                return false;
            }
        };
        try {
            const stats = statSync(path);
            return {
                path,
                childDirectoryPaths: stats.isDirectory() ? readdirSync(path).filter(filter) : [],
            };
        } catch (e) {
            throw error(500, "Read Stats Error");
        }
    } else return {
        path: "",
        childDirectoryPaths: (await getDriveList()).map(dirve => dirve.mountpoints.map(mp => mp.path.replaceAll("\\", "/"))).flat(1),
    };
}) satisfies PageServerLoad<ManagerData>;