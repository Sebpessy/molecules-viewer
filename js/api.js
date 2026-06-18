// Lists persistence. Phase 1: localStorage adapter. Phase 2 swaps the body of
// these functions for Supabase calls — the async signatures stay identical so
// nothing else changes.

import { uid } from "./util.js";

const KEY = "mv_lists_v1";

export const DEFAULT_SETTINGS = { secondsEach: 20, voice: true, music: true, track: 0, loop: false };

function read(){
  try{ return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch(e){ return []; }
}
function write(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }
function now(){ return new Date().toISOString(); }

export async function listLists(){
  return read().sort((a, b) =>
    (a.sort_order - b.sort_order) || (a.created_at < b.created_at ? -1 : 1));
}

export async function getList(id){ return read().find(l => l.id === id) || null; }

export async function createList(name){
  const arr = read();
  const t = now();
  const list = {
    id: uid(),
    name: name || "Untitled list",
    molecules: [],
    settings: { ...DEFAULT_SETTINGS },
    sort_order: arr.length,
    created_at: t,
    updated_at: t
  };
  arr.push(list); write(arr);
  return list;
}

export async function updateList(id, patch){
  const arr = read();
  const l = arr.find(x => x.id === id);
  if(!l) return null;
  Object.assign(l, patch, { updated_at: now() });
  write(arr);
  return l;
}

export async function deleteList(id){ write(read().filter(l => l.id !== id)); }

export async function duplicateList(id){
  const arr = read();
  const src = arr.find(l => l.id === id);
  if(!src) return null;
  const t = now();
  const copy = {
    ...JSON.parse(JSON.stringify(src)),
    id: uid(),
    name: src.name + " (copy)",
    sort_order: arr.length,
    created_at: t,
    updated_at: t
  };
  arr.push(copy); write(arr);
  return copy;
}

export async function reorderLists(ids){
  const arr = read();
  ids.forEach((id, i) => { const l = arr.find(x => x.id === id); if(l) l.sort_order = i; });
  write(arr);
}
