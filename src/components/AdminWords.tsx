import React, { useState } from "react";
import { useStore } from "../store";
import { PlusCircle, Edit3, Trash2, X } from "lucide-react";

export default function AdminWords({ onClose }: { onClose?: () => void }) {
  const { addWord, updateWord, deleteWord, showToast } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ id: "", word: "", meaning: "", emoji: "", category: "garden", color: "#FFFFFF", position: [0,0,0], scale: 1, thumbnail: "" });
  const [error, setError] = useState<string | null>(null);

  const words = useStore((s) => s.vocab || []);

  const startAdd = () => {
    setEditingId(null);
    setForm({ id: `w_${Math.random().toString(36).slice(2,8)}`, word: "", meaning: "", emoji: "🔸", category: "garden", color: "#F59E0B", position: [0,0,0], scale: 1 });
  };

  const startEdit = (w: any) => {
    setEditingId(w.id);
    setForm({ ...w });
  };

  const save = () => {
    if (!form.id || !form.word) return;
    const obj = { ...form };
    setError(null);
    let ok = false;
    if (editingId) {
      ok = updateWord(obj);
      if (ok) {
        showToast("Đã cập nhật", `Từ ${obj.word} đã được cập nhật.`, "✅", "success");
      } else {
        setError("Cập nhật thất bại");
      }
    } else {
      ok = addWord(obj);
      if (ok) {
        showToast("Đã thêm", `Từ ${obj.word} đã được thêm vào danh sách.`, "🎉", "success");
      } else {
        setError("ID đã tồn tại — chọn ID khác.");
      }
    }
    if (ok) {
      setEditingId(null);
      setForm({ id: "", word: "", meaning: "", emoji: "", category: "garden", color: "#FFFFFF", position: [0,0,0], scale: 1, thumbnail: "" });
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 p-6 text-slate-50 overflow-auto">
      <div className="mx-auto max-w-6xl bg-slate-900/95 p-6 rounded-2xl border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black">Quản lý Từ vựng 3D</h2>
          <div className="flex items-center gap-2">
            <button onClick={startAdd} className="inline-flex items-center gap-2 bg-emerald-400 text-slate-900 px-4 py-2 rounded-2xl font-black"><PlusCircle/> Thêm</button>
            {onClose && <button onClick={onClose} className="inline-flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-2xl"><X/></button>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="space-y-3">
              { words.map((w: any) => (
                <div key={w.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-2xl border border-slate-700">
                  <div>
                    <div className="flex items-center gap-3">
                      {w.thumbnail ? <img src={w.thumbnail} alt={w.word} className="h-10 w-10 rounded-lg object-cover"/> : <div className="h-10 w-10 rounded-lg bg-slate-700 flex items-center justify-center">{w.emoji}</div>}
                      <div>
                        <div className="text-sm font-black">{w.word} <span className="text-xs text-slate-400">({w.id})</span></div>
                        <div className="text-xs text-slate-400">{w.meaning} • {w.category}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(w)} className="bg-slate-700 px-3 py-2 rounded-2xl"><Edit3/></button>
                    <button onClick={() => { if (confirm('Xóa từ ' + w.word + '?')) { deleteWord(w.id); } }} className="bg-rose-500 px-3 py-2 rounded-2xl"><Trash2/></button>
                  </div>
                </div>
              )) }
            </div>
          </div>

          <div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <h3 className="font-black mb-3">{editingId ? 'Chỉnh sửa' : 'Thêm mới'}</h3>
              <div className="space-y-2">
                <input value={form.id} onChange={(e)=>setForm({...form,id:e.target.value})} className="w-full p-2 rounded bg-slate-900" placeholder="id" />
                <input value={form.word} onChange={(e)=>setForm({...form,word:e.target.value})} className="w-full p-2 rounded bg-slate-900" placeholder="word" />
                <input value={form.meaning} onChange={(e)=>setForm({...form,meaning:e.target.value})} className="w-full p-2 rounded bg-slate-900" placeholder="meaning" />
                <input value={form.emoji} onChange={(e)=>setForm({...form,emoji:e.target.value})} className="w-full p-2 rounded bg-slate-900" placeholder="emoji" />
                <input value={form.thumbnail} onChange={(e)=>setForm({...form,thumbnail:e.target.value})} className="w-full p-2 rounded bg-slate-900" placeholder="thumbnail URL (optional)" />
                {form.thumbnail && <div className="py-2"><img src={form.thumbnail} alt="preview" className="h-24 rounded-md object-cover"/></div>}
                {error && <div className="text-rose-400 text-sm">{error}</div>}
                <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="w-full p-2 rounded bg-slate-900">
                  <option value="garden">garden</option>
                  <option value="pet">pet</option>
                  <option value="sea">sea</option>
                  <option value="animals">animals</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={save} className="bg-emerald-400 text-slate-900 px-4 py-2 rounded-2xl font-black">Lưu</button>
                  <button onClick={()=>{ setEditingId(null); setForm({id:'',word:'',meaning:'',emoji:'',category:'garden',color:'#fff',position:[0,0,0],scale:1}) }} className="bg-slate-700 px-4 py-2 rounded-2xl">Hủy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
