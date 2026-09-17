import fs from "fs";
import path from "path";
import crypto from "crypto";

// 회원 정보는 서버의 data/members.json 파일에 저장합니다.
// (별도 DB 없이 운영하는 구조라 파일이 곧 회원 명부입니다.)
const FILE = path.join(process.cwd(), "data", "members.json");

export type MemberStatus = "pending" | "approved" | "rejected";

export type Member = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cohortId: string; // 신청한 과정·기수
  status: MemberStatus;
  role: "member" | "admin";
  passwordHash: string;
  joinedAt: string;
  decidedAt?: string;
  decidedBy?: string;
};

export type PublicMember = Omit<Member, "passwordHash">;

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

function readAll(): Member[] {
  ensureFile();
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeAll(list: Member[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf-8");
}

// scrypt 해시 (외부 의존성 없이 Node 기본 모듈만 사용)
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${key}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const check = crypto.scryptSync(password, salt, 32).toString("hex");
  const a = Buffer.from(key, "hex");
  const b = Buffer.from(check, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function strip(m: Member): PublicMember {
  const { passwordHash: _omit, ...rest } = m;
  return rest;
}

export function listMembers(): PublicMember[] {
  return readAll()
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .map(strip);
}

export function findByEmail(email: string): Member | null {
  const key = email.trim().toLowerCase();
  return readAll().find((m) => m.email === key) ?? null;
}

export function findById(id: string): Member | null {
  return readAll().find((m) => m.id === id) ?? null;
}

export function createMember(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  cohortId: string;
}): { ok: true; member: PublicMember } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  if (findByEmail(email)) return { ok: false, error: "이미 가입된 이메일이에요." };

  const member: Member = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email,
    phone: input.phone?.trim() || undefined,
    cohortId: input.cohortId,
    status: "pending", // 운영자 승인 전까지는 대기 상태
    role: "member",
    passwordHash: hashPassword(input.password),
    joinedAt: new Date().toISOString(),
  };

  const list = readAll();
  list.push(member);
  writeAll(list);
  return { ok: true, member: strip(member) };
}

export function decideMember(id: string, status: MemberStatus, by: string): PublicMember | null {
  const list = readAll();
  const idx = list.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status, decidedAt: new Date().toISOString(), decidedBy: by };
  writeAll(list);
  return strip(list[idx]);
}

export function removeMember(id: string): boolean {
  const list = readAll();
  const next = list.filter((m) => m.id !== id);
  if (next.length === list.length) return false;
  writeAll(next);
  return true;
}

export function counts() {
  const list = readAll();
  return {
    total: list.length,
    pending: list.filter((m) => m.status === "pending").length,
    approved: list.filter((m) => m.status === "approved").length,
    rejected: list.filter((m) => m.status === "rejected").length,
  };
}
