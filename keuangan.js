import React, { useState, useEffect, useMemo } from 'react';
import { auth, googleProvider } from './firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  Trash2,
  AlertTriangle,
  Settings,
  Coins,
  X,
  AlertCircle,
  Heart,
  Star,
  Circle,
  Plus,
  LayoutDashboard,
  PieChart,
  Brain,
  Palette,
  Edit2,
  Save,
  Check,
  ChevronRight,
  LogOut,
  Search,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const App = () => {
  // --- UI State (Navigation) ---
  const [activeTab, setActiveTab] = useState('home');

  // --- Tema Warna ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('boros_biru_theme');
    return saved ? JSON.parse(saved) : {
      name: 'Sky Blue',
      primary: 'from-sky-400 to-blue-700',
      secondary: 'bg-blue-600',
      accent: 'text-blue-600',
      bg: 'bg-[#F0F9FF]',
      border: 'border-blue-50',
      light: 'bg-blue-50'
    };
  });

  const themes = [
    { name: 'Sky Blue', primary: 'from-sky-400 to-blue-700', secondary: 'bg-blue-600', accent: 'text-blue-600', bg: 'bg-[#F0F9FF]', border: 'border-blue-50', light: 'bg-blue-50' },
    { name: 'Sweet Pink', primary: 'from-pink-400 to-rose-600', secondary: 'bg-pink-600', accent: 'text-pink-600', bg: 'bg-[#FFF1F2]', border: 'border-pink-50', light: 'bg-pink-50' },
    { name: 'Forest Green', primary: 'from-emerald-400 to-green-700', secondary: 'bg-green-600', accent: 'text-green-600', bg: 'bg-[#F0FDF4]', border: 'border-green-50', light: 'bg-green-50' },
    { name: 'Midnight Purple', primary: 'from-violet-500 to-purple-800', secondary: 'bg-purple-600', accent: 'text-purple-600', bg: 'bg-[#FAF5FF]', border: 'border-purple-50', light: 'bg-purple-50' },
    { name: 'Sunset Orange', primary: 'from-orange-400 to-red-600', secondary: 'bg-orange-600', accent: 'text-orange-600', bg: 'bg-[#FFF7ED]', border: 'border-orange-50', light: 'bg-orange-50' }
  ];

  const pinterestPresets = [
    'https://i.pinimg.com/1200x/aa/e4/e9/aae4e9e6092a702eeb0dd151f2130b92.jpg',
    'https://i.pinimg.com/736x/17/ff/e3/17ffe30adf0c171bca18b7e00a2b02ed.jpg',
    'https://i.pinimg.com/1200x/73/3f/91/733f914be14e4f3f9e549366eb1af701.jpg',
    'https://i.pinimg.com/1200x/1d/8e/d4/1d8ed44fa8bc2afbed44bb761cbc5186.jpg',
    'https://i.pinimg.com/736x/8f/4b/2b/8f4b2bfdb49792f5815725b6a0cd0b0c.jpg',
    'https://i.pinimg.com/1200x/00/a9/96/00a996135faa6e86caa64010404435c8.jpg',
    'https://i.pinimg.com/736x/bf/8b/cd/bf8bcd9f3dbfb3a5f7f0051fb8083292.jpg',
    'https://i.pinimg.com/736x/a3/b9/47/a3b947085349dde2e52c7a5ae1cbb065.jpg',
    'https://i.pinimg.com/736x/d1/11/df/d111df7a897afd623d7b4b2fa6ab758e.jpg',
    'https://i.pinimg.com/736x/f9/0f/f9/f90ff95d8fd817b31106123a77a0d922.jpg',
    'https://i.pinimg.com/736x/01/7a/f5/017af5554f403088a9e2d0735c5bc266.jpg',
    'https://i.pinimg.com/736x/a5/3d/6c/a53d6c7b61ce8370f9a03f4f6f292182.jpg'
  ];

  const MOTIVATION_QUOTES = [
    "Gaji itu numpang lewat, usahakan mampir ke tabungan ya! 💸",
    "Diskon 50% tetap lebih mahal daripada tidak beli sama sekali. 🙅‍♀️",
    "Kaya itu bukan tentang seberapa banyak uang yang dihasilkan, tapi seberapa banyak yang disimpan. 💎",
    "Checkout sekarang nyeselnya akhir bulan, yuk ditahan! 🛒",
    "Sedikit-sedikit lama-lama jadi bukit, tabung terus bestie! ⛰️",
    "Ingat, wishlist itu nggak harus dibeli semua hari ini. 📝",
    "Gaya hidup minimalis, tabungan maksimalis! ✨",
    "Beli karena butuh, bukan karena lucu. 🧸",
    "Pikirkan 3 kali sebelum checkout barang yang nggak penting. 🤔",
    "Dompet sehat, hati pun tenang. 🧘‍♀️"
  ];

  // --- Profil Pengguna ---
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('boros_biru_profile');
    return saved ? JSON.parse(saved) : { name: 'Cantik', emoji: pinterestPresets[0] };
  });

  // --- Simpan Data ke Browser ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('boros_biru_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyLimit, setMonthlyLimit] = useState(() => {
    const saved = localStorage.getItem('boros_biru_limit');
    return saved ? JSON.parse(saved) : 2000000;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('boros_biru_cats');
    const defaultCats = [
      // Kategori Pengeluaran (Expense)
      { name: 'Umum', image: null, type: 'expense' },
      { name: 'Makanan 🍰', image: null, type: 'expense' },
      { name: 'Jajan 🥤', image: null, type: 'expense' },
      { name: 'Transport 🏎️', image: null, type: 'expense' },
      { name: 'Belanja 🛍️', image: null, type: 'expense' },
      { name: 'Skincare 🧴', image: null, type: 'expense' },
      
      // Kategori Pemasukan (Income)
      { name: 'Gaji 💸', image: null, type: 'income' },
      { name: 'Investasi 📈', image: null, type: 'income' },
      { name: 'Uang Jajan 🎁', image: null, type: 'income' },
      { name: 'Hiburan/Bonus 🏆', image: null, type: 'income' }
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(c => {
          let item = typeof c === 'string' ? { name: c, image: null } : { ...c };
          if (!item.type) {
            const lowerName = item.name.toLowerCase();
            const incomeKeywords = ['gaji', 'investasi', 'uang jajan', 'hiburan', 'bonus', 'income', 'pemasukan'];
            const isIncome = incomeKeywords.some(kw => lowerName.includes(kw));
            item.type = isIncome ? 'income' : 'expense';
          }
          return item;
        });
      } catch (e) {
        console.error("Error parsing saved categories:", e);
      }
    }
    return defaultCats;
  });

  const [savings, setSavings] = useState(() => {
    const saved = localStorage.getItem('boros_biru_savings');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Dana Darurat 🚨', target: 5000000, current: 1200000 },
      { id: 2, name: 'Liburan Bali 🏖️', target: 3000000, current: 450000 }
    ];
  });

  // --- Form State ---
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Gaji 💸');
  const [mood, setMood] = useState('Biasa');
  const [type, setType] = useState('income');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // --- UI State ---
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCatType, setNewCatType] = useState('expense');

  // --- Savings Manager State ---
  const [isAddingSaving, setIsAddingSaving] = useState(false);
  const [newSaving, setNewSaving] = useState({ name: '', target: '', current: '' });

  // --- Edit Transaction State ---
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ amount: '', description: '', category: '', date: '', type: '', mood: '' });

  // --- Edit Savings State ---
  const [editingSavingId, setEditingSavingId] = useState(null);
  const [editSavingFormData, setEditSavingFormData] = useState({ current: '' });

  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // Email yang diizinkan (Ganti sesuai kebutuhan)
  const ALLOWED_EMAIL = 'suci.setiani65@smk.belajar.id';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [savingToDelete, setSavingToDelete] = useState(null);
  const [savingToEditConfirm, setSavingToEditConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Format Helpers ---
  const formatNumberWithDots = (val) => {
    if (!val) return '';
    const numeric = val.toString().replace(/\D/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseFormattedNumber = (val) => {
    return val.toString().replace(/\./g, '');
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(num);
  };

  // --- Mood Configuration ---
  const moodList = [
    { label: 'Happy', emoji: '🥰' },
    { label: 'Sad', emoji: '🥺' },
    { label: 'Panic', emoji: '😱' },
    { label: 'Bored', emoji: '🥱' },
    { label: 'Angry', emoji: '😤' },
    { label: 'Chill', emoji: '😎' }
  ];

  useEffect(() => {
    localStorage.setItem('boros_biru_data', JSON.stringify(transactions));
    localStorage.setItem('boros_biru_limit', JSON.stringify(monthlyLimit));
    localStorage.setItem('boros_biru_cats', JSON.stringify(categories));
    localStorage.setItem('boros_biru_savings', JSON.stringify(savings));
    localStorage.setItem('boros_biru_theme', JSON.stringify(theme));
    localStorage.setItem('boros_biru_profile', JSON.stringify(profile));
  }, [transactions, monthlyLimit, categories, savings, theme, profile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === ALLOWED_EMAIL) {
          setIsLoggedIn(true);
          setUserEmail(user.email);
        } else {
          // Auto logout if email is not allowed
          signOut(auth);
          setIsLoggedIn(false);
          setUserEmail('');
        }
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const dailyQuote = useMemo(() => {
    return MOTIVATION_QUOTES[new Date().getDate() % MOTIVATION_QUOTES.length];
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - today.getDate() + 1;

    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const expenseThisMonth = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((acc, curr) => acc + curr.amount, 0);

    const usagePercentage = monthlyLimit > 0 ? (expenseThisMonth / monthlyLimit) * 100 : 0;
    const safeToSpend = Math.max(0, (monthlyLimit - expenseThisMonth) / daysLeft);

    const catStats = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return {
      balance: income - expense,
      totalIncome: income,
      totalExpense: expense,
      expenseThisMonth,
      usagePercentage,
      safeToSpend,
      catStats,
      isOverLimit: expenseThisMonth > monthlyLimit,
      isWarning: usagePercentage >= 80 && usagePercentage <= 100
    };
  }, [transactions, monthlyLimit, currentMonth]);

  const handleTypeChange = (newType) => {
    setType(newType);
    const filteredCats = categories.filter(c => c.type === newType);
    if (filteredCats.length > 0) {
      setCategory(filteredCats[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(parseFormattedNumber(amount));
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (type === 'expense' && !description) return;

    const newTransaction = {
      id: Date.now(),
      amount: numAmount,
      description: type === 'expense' ? description : 'Pemasukan',
      category,
      mood: type === 'expense' ? mood : 'Netral',
      type,
      date: selectedDate
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setAmount('');
    setDescription('');

    // reset category dropdown to the first of its type
    const filteredCats = categories.filter(c => c.type === type);
    if (filteredCats.length > 0) {
      setCategory(filteredCats[0].name);
    }
  };

  const handleSaveCategory = () => {
    if (!newCatName.trim()) return;

    const normalizedNewName = newCatName.trim().toLowerCase();
    const isDuplicate = categories.some(c => c.name.toLowerCase() === normalizedNewName);

    if (editingCategory) {
      if (isDuplicate && newCatName.trim() !== editingCategory) return;

      const newName = newCatName.trim();
      const newImage = newCatImage.trim() || null;
      const updatedCategories = categories.map(c =>
        c.name === editingCategory ? { ...c, name: newName, image: newImage, type: c.type || newCatType } : c
      );
      setCategories(updatedCategories);
      localStorage.setItem('boros_biru_cats', JSON.stringify(updatedCategories));

      const updatedTransactions = transactions.map(t =>
        t.category === editingCategory ? { ...t, category: newName } : t
      );
      setTransactions(updatedTransactions);
      localStorage.setItem('boros_biru_data', JSON.stringify(updatedTransactions));

      setEditingCategory(null);
      setNewCatName('');
      setNewCatImage('');
    } else {
      if (isDuplicate) return;

      const updated = [...categories, { name: newCatName.trim(), image: newCatImage.trim() || null, type: newCatType }];
      setCategories(updated);
      localStorage.setItem('boros_biru_cats', JSON.stringify(updated));
      setNewCatName('');
      setNewCatImage('');
    }
  };

  const deleteTransaction = (t) => {
    setTransactionToDelete(t);
  };

  const executeDelete = () => {
    if (transactionToDelete) {
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
      setTransactionToDelete(null);
    }
  };

  const startEdit = (t) => {
    setTransactionToEdit(t);
  };

  const executeStartEdit = () => {
    if (transactionToEdit) {
      setEditingId(transactionToEdit.id);
      setEditFormData({
        amount: formatNumberWithDots(transactionToEdit.amount.toString()),
        description: transactionToEdit.description,
        category: transactionToEdit.category,
        date: transactionToEdit.date,
        type: transactionToEdit.type,
        mood: transactionToEdit.mood
      });
      setTransactionToEdit(null);
    }
  };

  const saveEdit = () => {
    const numAmount = parseFloat(parseFormattedNumber(editFormData.amount));
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (editFormData.type === 'expense' && !editFormData.description) return;

    setTransactions(prev => prev.map(t =>
      t.id === editingId
        ? {
          ...t,
          amount: numAmount,
          description: editFormData.type === 'expense' ? editFormData.description : 'Pemasukan',
          category: editFormData.category,
          date: editFormData.date,
          type: editFormData.type,
          mood: editFormData.type === 'expense' ? editFormData.mood : 'Netral'
        }
        : t
    ));
    setEditingId(null);
  };

  const getCategoryIconSmall = (catName) => {
    const cat = categories.find(c => c.name === catName);
    if (cat && cat.image) {
      return <img src={cat.image} alt={catName} className="w-3 h-3 rounded-full object-cover" />;
    }
    return <Star size={10} fill="currentColor" className="text-amber-400" />;
  };

  const handleDeleteCategory = (catToDelete) => {
    if (catToDelete === 'Umum') return;
    const updated = categories.filter(c => c.name !== catToDelete);
    setCategories(updated);
    localStorage.setItem('boros_biru_cats', JSON.stringify(updated));
    if (category === catToDelete) setCategory('Umum');
  };

  // --- Star/Savings Logic ---
  const handleCreateSaving = (e) => {
    e.preventDefault();
    if (!newSaving.name || !newSaving.target) return;
    const item = {
      id: Date.now(),
      name: newSaving.name,
      target: parseFloat(parseFormattedNumber(newSaving.target)),
      current: parseFloat(parseFormattedNumber(newSaving.current || 0))
    };
    setSavings([...savings, item]);
    setNewSaving({ name: '', target: '', current: '' });
    setIsAddingSaving(false);
  };

  const requestDeleteSaving = (s) => {
    setSavingToDelete(s);
  };

  const executeDeleteSaving = () => {
    if (savingToDelete) {
      setSavings(savings.filter(s => s.id !== savingToDelete.id));
      setSavingToDelete(null);
    }
  };

  const requestEditSaving = (s) => {
    setSavingToEditConfirm(s);
  };

  const executeStartEditSaving = () => {
    if (savingToEditConfirm) {
      setEditingSavingId(savingToEditConfirm.id);
      setEditSavingFormData({ current: formatNumberWithDots(savingToEditConfirm.current.toString()) });
      setSavingToEditConfirm(null);
    }
  };

  const saveEditSaving = () => {
    const numCurrent = parseFloat(parseFormattedNumber(editSavingFormData.current || 0));
    setSavings(prev => prev.map(s =>
      s.id === editingSavingId ? { ...s, current: numCurrent } : s
    ));
    setEditingSavingId(null);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ALLOWED_EMAIL) {
        await signOut(auth);
        alert('Akses Ditolak: Anda tidak memiliki akses ke aplikasi ini.');
      }
    } catch (error) {
      console.error("Login failed:", error);
      const code = error?.code || 'unknown';
      const msg = error?.message || 'Tidak ada pesan error.';
      alert(`Gagal login!\n\nKode Error: ${code}\n\nDetail: ${msg}\n\nScreenshot pesan ini dan kirim ke developer ya!`);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = async () => {
    await signOut(auth);
    setShowLogoutConfirm(false);
  };

  const handleExportData = () => {
    const data = {
      boros_biru_data: localStorage.getItem('boros_biru_data'),
      boros_biru_limit: localStorage.getItem('boros_biru_limit'),
      boros_biru_cats: localStorage.getItem('boros_biru_cats'),
      boros_biru_savings: localStorage.getItem('boros_biru_savings'),
      boros_biru_theme: localStorage.getItem('boros_biru_theme'),
      boros_biru_profile: localStorage.getItem('boros_biru_profile'),
    };
    const jsonStr = JSON.stringify(data);
    navigator.clipboard.writeText(jsonStr)
      .then(() => alert('Data berhasil disalin (Copy)!\n\nSekarang buka aplikasi di perangkat lain (atau link baru), masuk ke Pengaturan, pilih "Import Data" dan paste kode tersebut.'))
      .catch(() => {
        const txt = prompt('Browser tidak mengizinkan copy otomatis. Copy teks kode ini secara manual:', jsonStr);
        if(txt) alert('Data berhasil disalin! Silakan Import di perangkat/link lain.');
      });
  };

  const handleImportData = () => {
    const jsonStr = prompt('Paste (Tempel) kode data Backup dari perangkat sebelumnya di sini:');
    if (!jsonStr) return;
    try {
      const data = JSON.parse(jsonStr);
      if (data.boros_biru_data) localStorage.setItem('boros_biru_data', data.boros_biru_data);
      if (data.boros_biru_limit) localStorage.setItem('boros_biru_limit', data.boros_biru_limit);
      if (data.boros_biru_cats) localStorage.setItem('boros_biru_cats', data.boros_biru_cats);
      if (data.boros_biru_savings) localStorage.setItem('boros_biru_savings', data.boros_biru_savings);
      if (data.boros_biru_theme) localStorage.setItem('boros_biru_theme', data.boros_biru_theme);
      if (data.boros_biru_profile) localStorage.setItem('boros_biru_profile', data.boros_biru_profile);
      alert('Selesai! Data berhasil di-import. Aplikasi akan dimuat ulang.');
      window.location.reload();
    } catch (e) {
      alert('Gagal! Format kode data tidak valid.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen bg-[#F0F9FF] text-slate-800 font-['Quicksand',sans-serif] flex items-center justify-center p-4 relative overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className={`absolute top-[10%] left-[10%] animate-float-slow opacity-20 text-blue-600`}><Heart size={70} fill="currentColor" /></div>
          <div className={`absolute bottom-[20%] right-[10%] animate-spin-slow opacity-20 text-blue-600`}><Star size={50} fill="currentColor" /></div>
          <div className={`absolute -top-24 -left-24 w-[30rem] h-[30rem] rounded-full blur-3xl animate-pulse opacity-10 bg-blue-600`}></div>
        </div>

        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border-4 border-white relative z-10 animate-pop">
          <div className="flex flex-col items-center mb-10">
            <div className={`p-4 rounded-3xl shadow-xl bg-gradient-to-br from-sky-400 to-blue-700 text-white mb-4 animate-float border-4 border-white`}>
              <Wallet size={36} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Anti Boros <span className="animate-pulse inline-block">💎</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-blue-600">
              Silakan Masuk
            </p>
          </div>

          <div className="space-y-6">
            {authLoading ? (
              <div className="flex justify-center p-8">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <button onClick={handleLogin} className="w-full py-5 rounded-[2rem] font-black text-slate-700 shadow-xl bg-white hover:bg-slate-50 border-2 border-slate-100 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" /><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" /><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" /><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" /></g></svg>
                LOGIN DENGAN GOOGLE
              </button>
            )}
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500;700;900&display=swap');
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-spin-slow { animation: spin 12s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} text-slate-800 font-['Quicksand',sans-serif] overflow-x-hidden relative pb-28 transition-colors duration-500`}>

      {/* Background Animasi */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-[15%] left-[10%] animate-float-slow opacity-20 ${theme.accent}`}><Heart size={70} fill="currentColor" /></div>
        <div className={`absolute top-[25%] right-[15%] animate-spin-slow opacity-20 ${theme.accent}`}><Star size={50} fill="currentColor" /></div>
        <div className={`absolute bottom-[20%] left-[20%] animate-pulse opacity-20 ${theme.accent}`}><Circle size={120} fill="currentColor" /></div>
        <div className={`absolute -top-24 -left-24 w-[30rem] h-[30rem] rounded-full blur-3xl animate-pulse opacity-10 ${theme.secondary}`}></div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-10 relative z-10">

        {/* Header */}
        <header className="mb-10 relative">
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <button
              onClick={() => setShowProfileSettings(true)}
              className="flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 shadow-sm"
            >
              {profile.emoji.startsWith('http') ? (
                <img src={profile.emoji} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-sm" />
              ) : (
                <span className="text-base">{profile.emoji}</span>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-slate-800 leading-tight">
                  Halo, {profile.name}
                </p>
                <p className={`text-[8px] font-bold uppercase tracking-widest ${theme.accent} leading-tight`}>{userEmail.split('@')[0]}</p>
              </div>
            </button>
          </div>

          <div className="flex flex-col items-center text-center pt-16 md:pt-0">
            <div className={`p-5 rounded-3xl shadow-2xl bg-gradient-to-br mb-4 animate-float border-4 border-white ${type === 'income' ? 'from-emerald-400 to-teal-600 text-white' : theme.primary + ' text-white'}`}>
              <Wallet size={44} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Anti Boros <span className="animate-pulse inline-block">💎</span>
            </h1>
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-1 ${theme.accent}`}>
              Jangan khilaf yaaa ✨
            </p>

            <div className="mt-4 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm inline-block max-w-[80%]">
              <p className="text-[11px] font-bold text-slate-700 italic">"{dailyQuote}"</p>
            </div>
          </div>
        </header>

        {/* Notifikasi Limit */}
        {stats.isOverLimit && activeTab === 'home' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-[2.5rem] flex items-center gap-4 shadow-2xl animate-shake border-2 border-white/30">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-md"><AlertCircle size={32} /></div>
            <div>
              <p className="font-black text-xl">Duh, limitnya jebol! 😱</p>
              <p className="text-sm opacity-90 font-medium italic">Batas jajan bulan ini sudah habis ya cantik! 💎</p>
            </div>
          </div>
        )}

        {/* Panel Edit Profil */}
        {showProfileSettings && (
          <div className="mb-10 p-8 rounded-[3rem] bg-white/95 backdrop-blur-md shadow-xl border-4 border-white animate-pop">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black flex items-center gap-3 text-slate-800">
                <span className="text-2xl">
                  {profile.emoji.startsWith('http') ? <img src={profile.emoji} className="w-8 h-8 rounded-full object-cover" alt="avatar" /> : profile.emoji}
                </span>
                Edit Profil
              </h4>
              <button onClick={() => setShowProfileSettings(false)} className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-2">Nama Panggilan</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Nama..."
                  className="w-full px-5 py-4 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-slate-200 outline-none font-bold text-slate-800 text-sm shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-2">Pilih Avatar Aesthetic ✨</label>
                <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-[1.5rem] shadow-inner">
                  {pinterestPresets.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setProfile({ ...profile, emoji: url })}
                      className={`w-12 h-12 rounded-full overflow-hidden transition-all border-2 ${profile.emoji === url ? 'border-sky-400 scale-110 shadow-lg' : 'border-transparent hover:scale-110 opacity-70 grayscale'}`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel Pengaturan */}
        {showSettings && (
          <div className="mb-10 p-8 rounded-[3rem] bg-white/95 backdrop-blur-md shadow-xl border-4 border-white animate-pop">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black flex items-center gap-3 text-slate-800"><Settings className="animate-spin-slow" /> Pengaturan</h4>
              <button onClick={() => setShowSettings(false)} className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Kolom 1: Limit & Tema */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-2">Limit Jajan Bulanan (Rp)</label>
                  <input
                    type="text"
                    value={formatNumberWithDots(monthlyLimit)}
                    onChange={(e) => setMonthlyLimit(Number(parseFormattedNumber(e.target.value)))}
                    className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-slate-200 outline-none font-bold text-slate-800 text-lg shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-2 flex items-center gap-2"><Palette size={14} /> Tema Warna</label>
                  <div className="grid grid-cols-5 gap-2">
                    {themes.map(t => (
                      <button key={t.name} onClick={() => setTheme(t)} className={`h-10 rounded-xl transition-all border-2 ${theme.name === t.name ? 'border-slate-800 scale-110' : 'border-transparent'} bg-gradient-to-br ${t.primary}`}></button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kolom 3: Kategori */}
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-2 flex items-center gap-2">
                  <Star size={14} className="text-amber-400" /> {editingCategory ? 'Edit Kategori' : 'Kategori Baru'}
                </label>
                
                {/* Selector Tipe Kategori Baru */}
                <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 mb-2">
                  <button
                    type="button"
                    onClick={() => setNewCatType('income')}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black transition-all ${newCatType === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    MASUK 💰
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('expense')}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black transition-all ${newCatType === 'expense' ? 'bg-white shadow-sm ' + theme.accent : 'text-slate-400'}`}
                  >
                    KELUAR 💸
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder={editingCategory ? "Ubah nama kategori..." : "Nama Kategori..."}
                    className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-200 outline-none font-bold text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveCategory()}
                  />
                  {editingCategory && (
                    <button onClick={() => { setEditingCategory(null); setNewCatName(''); setNewCatImage(''); }} className="p-3 rounded-2xl shadow-md bg-slate-200 text-slate-500 hover:scale-105 active:scale-95 transition-all">
                      <X size={18} />
                    </button>
                  )}
                  <button onClick={handleSaveCategory} className={`text-white p-3 rounded-2xl shadow-md ${editingCategory ? 'bg-amber-500' : 'bg-slate-900'} flex items-center justify-center hover:scale-105 active:scale-95 transition-all`}>
                    {editingCategory ? <Check size={18} /> : <Star size={18} fill="currentColor" className="text-amber-400" />}
                  </button>
                </div>

                {/* Pemisahan Visual Kategori di Settings */}
                <div className="space-y-4 mt-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Pemasukan 💰</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.filter(c => c.type === 'income').map(c => (
                        <div key={c.name} className={`px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 border transition-all ${editingCategory === c.name ? 'bg-amber-100 text-amber-800 border-amber-300 scale-105 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {c.image ? <img src={c.image} alt={c.name} className="w-4 h-4 rounded-full object-cover" /> : <Star size={10} fill="currentColor" className={editingCategory === c.name ? "text-amber-500" : "text-amber-400"} />}
                          <span className={`${c.name !== 'Umum' ? 'cursor-pointer hover:text-amber-500' : ''}`} onClick={() => {
                            if (c.name !== 'Umum') {
                              setEditingCategory(c.name);
                              setNewCatName(c.name);
                              setNewCatImage(c.image || '');
                              setNewCatType(c.type || 'income');
                            }
                          }}>
                            {c.name}
                          </span>
                          {c.name !== 'Umum' && <button onClick={() => handleDeleteCategory(c.name)} className={`${editingCategory === c.name ? 'text-amber-500 hover:text-red-500' : 'text-slate-300 hover:text-red-500'}`}><X size={10} /></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>Pengeluaran 💸</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.filter(c => c.type === 'expense').map(c => (
                        <div key={c.name} className={`px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 border transition-all ${editingCategory === c.name ? 'bg-amber-100 text-amber-800 border-amber-300 scale-105 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {c.image ? <img src={c.image} alt={c.name} className="w-4 h-4 rounded-full object-cover" /> : <Star size={10} fill="currentColor" className={editingCategory === c.name ? "text-amber-500" : "text-amber-400"} />}
                          <span className={`${c.name !== 'Umum' ? 'cursor-pointer hover:text-amber-500' : ''}`} onClick={() => {
                            if (c.name !== 'Umum') {
                              setEditingCategory(c.name);
                              setNewCatName(c.name);
                              setNewCatImage(c.image || '');
                              setNewCatType(c.type || 'expense');
                            }
                          }}>
                            {c.name}
                          </span>
                          {c.name !== 'Umum' && <button onClick={() => handleDeleteCategory(c.name)} className={`${editingCategory === c.name ? 'text-amber-500 hover:text-red-500' : 'text-slate-300 hover:text-red-500'}`}><X size={10} /></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 font-bold ml-2 italic">* Klik teks kategori untuk mengubahnya</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-5 py-3.5 bg-white rounded-full shadow-md hover:scale-105 active:scale-95 transition-all text-red-500 border border-red-50 font-black text-[10px] uppercase tracking-widest"
              >
                <LogOut size={16} className="text-red-400" />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB CONTENT */}
        <div className="space-y-12 animate-pop">

          {/* BERANDA */}
          {activeTab === 'home' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12">
                <StatCard title="Saldo" value={stats.balance} icon={Coins} theme={`${theme.secondary} shadow-lg shadow-black/5`} />
                <StatCard title="Masuk" value={stats.totalIncome} icon={ArrowUpCircle} theme="bg-emerald-500 shadow-lg shadow-black/5" />
                <StatCard title="Keluar" value={stats.totalExpense} icon={ArrowDownCircle} theme="bg-rose-500 shadow-lg shadow-black/5" />
                <StatCard title="Sisa Limit" value={Math.max(0, monthlyLimit - stats.expenseThisMonth)} icon={AlertTriangle} theme={stats.isOverLimit ? "bg-red-600 animate-pulse" : (stats.isWarning ? "bg-amber-500" : "bg-slate-800")} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                  <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
                      <div className={`h-full transition-all duration-1000 ${stats.isOverLimit ? 'bg-red-400' : theme.secondary}`} style={{ width: `${Math.min(100, stats.usagePercentage)}%` }}></div>
                    </div>
                    <div className="flex bg-slate-100 p-1.5 rounded-[2rem] gap-1 mb-8">
                      <button type="button" onClick={() => handleTypeChange('income')} className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400'}`}>MASUK 💰</button>
                      <button type="button" onClick={() => handleTypeChange('expense')} className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black transition-all ${type === 'expense' ? 'bg-white shadow-md ' + theme.accent : 'text-slate-400'}`}>KELUAR 💸</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex gap-3">
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 outline-none font-bold text-xs" />
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 outline-none font-bold text-xs">
                          {categories.filter(c => c.type === type).map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">Rp</span>
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(formatNumberWithDots(e.target.value))}
                          placeholder="0"
                          className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-slate-200 outline-none font-black text-3xl"
                          required
                        />
                      </div>
                      {type === 'expense' && (
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beli apa?" className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 outline-none font-bold text-slate-600" required />
                      )}
                      {type === 'expense' && (
                        <div className="grid grid-cols-6 gap-1">
                          {moodList.map((m) => (
                            <button key={m.label} type="button" onClick={() => setMood(m.label)} className={`p-2 rounded-xl text-xl transition-all ${mood === m.label ? 'bg-white shadow-md scale-110 ring-2 ring-slate-100' : 'bg-slate-50 opacity-60'}`}>
                              {m.emoji}
                            </button>
                          ))}
                        </div>
                      )}
                      <button type="submit" className={`w-full py-5 rounded-[2.5rem] font-black text-white shadow-xl bg-gradient-to-r ${type === 'income' ? 'from-emerald-400 to-teal-500' : theme.primary}`}>SIMPAN 💎</button>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] shadow-2xl border-4 border-white flex flex-col h-full min-h-[500px]">
                    <div className="p-8 border-b-4 border-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><History size={24} className={theme.accent} /> Histori</h3>
                      <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari transaksi..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full sm:w-64 pl-10 pr-4 py-3 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-slate-200 outline-none font-bold text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                      {(() => {
                        const filtered = transactions.filter(t =>
                          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        const incomeList = filtered.filter(t => t.type === 'income');
                        const expenseList = filtered.filter(t => t.type === 'expense');
                        return (
                          <>
                            {incomeList.length > 0 && (
                              <>
                                <div className="flex items-center gap-3 py-2 px-1">
                                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Uang Masuk</span>
                                  </div>
                                  <div className="flex-1 h-px bg-emerald-100"></div>
                                  <span className="text-[10px] font-black text-emerald-500">{incomeList.length} transaksi</span>
                                </div>
                                <div className="space-y-3 mb-4">
                                  {incomeList.map(t => (
                                    <TransactionItem key={t.id} t={t} moodList={moodList} formatCurrency={formatCurrency} deleteTransaction={deleteTransaction} startEdit={startEdit} theme={theme} categories={categories} />
                                  ))}
                                </div>
                              </>
                            )}
                            {expenseList.length > 0 && (
                              <>
                                <div className="flex items-center gap-3 py-2 px-1">
                                  <div className="flex items-center gap-2 bg-red-50 px-4 py-1.5 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Uang Keluar</span>
                                  </div>
                                  <div className="flex-1 h-px bg-red-100"></div>
                                  <span className="text-[10px] font-black text-red-400">{expenseList.length} transaksi</span>
                                </div>
                                <div className="space-y-3">
                                  {expenseList.map(t => (
                                    <TransactionItem key={t.id} t={t} moodList={moodList} formatCurrency={formatCurrency} deleteTransaction={deleteTransaction} startEdit={startEdit} theme={theme} categories={categories} />
                                  ))}
                                </div>
                              </>
                            )}
                            {filtered.length === 0 && (
                              <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                                <History size={40} />
                                <p className="mt-3 text-sm font-bold">Belum ada transaksi</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* LAPORAN BULANAN */}
          {activeTab === 'analysis' && (() => {
            const rasioMenabung = stats.totalIncome > 0 ? Math.round(((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100) : 0;
            const topCat = Object.entries(stats.catStats).sort((a, b) => b[1] - a[1])[0];
            const isDefisit = stats.totalExpense > stats.totalIncome;
            const statusKeuangan = isDefisit ? 'Defisit' : 'Surplus';
            const statusSubtitle = isDefisit ? 'Waktunya ikat pinggang!' : 'Dompet aman sentosa!';
            const totalMax = Math.max(stats.totalIncome, stats.totalExpense, 1);
            
            // Progress Bar widths
            const isBothZero = stats.totalIncome === 0 && stats.totalExpense === 0;
            const incomeBarWidth = isBothZero ? 100 : (stats.totalIncome / totalMax) * 100;
            const expenseBarWidth = isBothZero ? 0 : (stats.totalExpense / totalMax) * 100;

            return (
              <div className="space-y-6">
                {/* 3 Insight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Rasio Menabung */}
                  <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-lg border border-slate-50 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                      <TrendingUp size={22} className="text-blue-500" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Rasio Menabung</p>
                    <p className={`text-3xl sm:text-4xl font-black ${rasioMenabung > 0 ? 'text-emerald-600' : (rasioMenabung < 0 ? 'text-rose-500' : 'text-slate-800')}`}>{rasioMenabung}%</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2 italic">Dihitung dari sisa saldo vs pemasukan</p>
                  </div>
                  {/* Kategori Terboros */}
                  <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-lg border border-slate-50 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
                      <TrendingDown size={22} className="text-rose-500" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Kategori Terboros</p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-800">{topCat ? topCat[0] : 'Belum ada'}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2 italic">{topCat ? `${formatCurrency(topCat[1])} dihabiskan` : 'Rp 0 dihabiskan'}</p>
                  </div>
                  {/* Status Keuangan */}
                  <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-lg border border-slate-50 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Heart size={22} className="text-emerald-500" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Status Keuangan</p>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className={`text-2xl sm:text-3xl font-black ${isDefisit ? 'text-rose-500' : 'text-emerald-600'}`}>{statusKeuangan}</span>
                      {!isDefisit ? (
                        <span className="inline-flex items-center justify-center bg-emerald-500 text-white rounded-[6px] p-0.5 w-5 h-5">
                          <Check size={12} strokeWidth={4} />
                        </span>
                      ) : (
                        <span>⚠️</span>
                      )}
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2 italic">{statusSubtitle}</p>
                  </div>
                </div>

                {/* Ringkasan Pemasukan vs Pengeluaran */}
                <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-lg border border-slate-50">
                  <p className="text-sm sm:text-base font-bold text-slate-800 italic text-center mb-8">
                    "Uang bukan segalanya, tapi kalau tidak ada uang pusingnya segalanya."
                  </p>
                  <div className="grid grid-cols-2 gap-6 sm:gap-10">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pemasukan Total</p>
                      <p className="text-xl sm:text-3xl font-black text-emerald-600">{formatCurrency(stats.totalIncome)}</p>
                      <div className="h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${incomeBarWidth}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pengeluaran Total</p>
                      <p className="text-xl sm:text-3xl font-black text-rose-500">{formatCurrency(stats.totalExpense)}</p>
                      <div className="h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-rose-500 rounded-full transition-all duration-700" style={{ width: `${expenseBarWidth}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown Kategori (Hanya muncul jika ada pengeluaran) */}
                {stats.totalExpense > 0 && (
                  <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-lg border border-slate-50">
                    <h3 className={`text-lg sm:text-xl font-black mb-6 flex items-center gap-3 ${theme.accent}`}><PieChart size={20} /> Breakdown Pengeluaran</h3>
                    <div className="space-y-4">
                      {Object.entries(stats.catStats).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
                        <div key={cat} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] sm:text-[11px] font-black text-slate-800 uppercase">
                            <span>{cat}</span>
                            <span>{formatCurrency(val)}</span>
                          </div>
                          <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                            <div className={`h-full ${theme.secondary} rounded-full transition-all duration-700`} style={{ width: `${(val / stats.totalExpense) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* FITUR SIMPANAN: STAR EDITION */}
          {activeTab === 'savings' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center sm:items-end flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <Star fill="#fbbf24" className="text-amber-400" /> Target HOPE ✨
                  </h2>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Wujudkan tabunganmu secara estetik</p>
                </div>
              </div>

              {/* Form Tambah Tabungan Baru */}
              {isAddingSaving ? (
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white animate-pop">
                  <div className="flex justify-between mb-6">
                    <h4 className="font-black text-xl">✨ Buat Target Baru</h4>
                    <button onClick={() => setIsAddingSaving(false)} className="text-slate-400"><X /></button>
                  </div>
                  <form onSubmit={handleCreateSaving} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nama Impian</label>
                      <input
                        type="text"
                        placeholder="Misal: Beli Konser Tulus 🎤"
                        value={newSaving.name}
                        onChange={(e) => setNewSaving({ ...newSaving, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none font-bold focus:ring-2 ring-slate-100"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Target Nominal</label>
                      <input
                        type="text"
                        placeholder="Rp 0"
                        value={formatNumberWithDots(newSaving.target)}
                        onChange={(e) => setNewSaving({ ...newSaving, target: formatNumberWithDots(e.target.value) })}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none font-bold focus:ring-2 ring-slate-100"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sudah Ada</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Rp 0"
                          value={formatNumberWithDots(newSaving.current)}
                          onChange={(e) => setNewSaving({ ...newSaving, current: formatNumberWithDots(e.target.value) })}
                          className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 outline-none font-bold focus:ring-2 ring-slate-100"
                        />
                        <button type="submit" className={`p-4 rounded-2xl text-white shadow-lg bg-slate-900 hover:scale-105 active:scale-95 transition-all`}>
                          <Save size={20} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savings.map(save => {
                  const progress = (save.current / save.target) * 100;
                  return (
                    <div key={save.id} className="relative group">
                      <div className="bg-white p-8 rounded-[3rem] border border-slate-50 relative overflow-hidden transition-all duration-500 group-hover:scale-[1.03] shadow-lg shadow-black/5 group-hover:shadow-2xl group-hover:border-transparent">
                        <div className={`absolute -top-10 -right-10 w-40 h-40 ${theme.secondary} blur-[80px] opacity-10 transition-opacity group-hover:opacity-30`}></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div>
                            <h4 className="text-xl font-black text-slate-800 leading-tight flex items-center gap-2">
                              {save.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${theme.secondary} animate-pulse`}></div>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                Target: {formatCurrency(save.target)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => requestEditSaving(save)}
                              className={`p-2 text-slate-300 hover:${theme.accent} transition-all`}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => requestDeleteSaving(save)}
                              className="p-2 text-slate-300 hover:text-red-400 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-black ${theme.accent} uppercase tracking-tighter mb-1`}>Terkumpul</span>
                              <p className="text-2xl font-black text-slate-800 tracking-tighter">
                                {formatCurrency(save.current).replace('Rp', '')}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-slate-400 italic">{Math.round(progress)}%</span>
                            </div>
                          </div>
                          <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-1 shadow-inner relative border border-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${theme.primary} shadow-sm`}
                              style={{ width: `${Math.min(100, progress)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-center">
                            <Star
                              size={24}
                              fill={progress >= 100 ? "currentColor" : "none"}
                              className={`${progress >= 100 ? theme.accent + " animate-bounce" : "text-slate-200"}`}
                            />
                          </div>
                        </div>
                        <div className={`absolute -bottom-6 -right-6 opacity-5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 ${theme.accent}`}>
                          <Star size={140} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Tombol Tambah Baru */}
                {!isAddingSaving && (
                  <button
                    onClick={() => setIsAddingSaving(true)}
                    className="bg-slate-950/40 border-4 border-dashed border-white/10 p-8 rounded-[3rem] min-h-[250px] flex flex-col items-center justify-center transition-all hover:bg-slate-950 hover:border-amber-400/50 group"
                  >
                    <div className="p-5 rounded-full bg-white/5 text-white/20 group-hover:text-amber-400 group-hover:scale-110 transition-all border border-white/5 group-hover:border-amber-400/30">
                      <Plus size={40} />
                    </div>
                    <span className="font-black uppercase text-[10px] tracking-[0.3em] mt-5 text-white/20 group-hover:text-white transition-colors">Tanam HOPE Baru ✨</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-sm animate-pop text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-50 text-red-500 rounded-full animate-shake">
                <LogOut size={32} />
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">Yakin mau keluar?</h4>
            <p className="text-sm font-bold text-slate-400 mb-8">Sesi kamu akan berakhir dan butuh login lagi nanti.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-4 rounded-[2rem] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">BATAL</button>
              <button onClick={executeLogout} className="flex-1 py-4 rounded-[2rem] font-black text-white shadow-xl bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] active:scale-95 transition-all">KELUAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {transactionToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-sm animate-pop text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-50 text-red-500 rounded-full animate-shake">
                <Trash2 size={32} />
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">Yakin mau dihapus?</h4>
            <p className="text-sm font-bold text-slate-400 mb-8">Data transaksi ini akan dihapus dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setTransactionToDelete(null)} className="flex-1 py-4 rounded-[2rem] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">BATAL</button>
              <button onClick={executeDelete} className="flex-1 py-4 rounded-[2rem] font-black text-white shadow-xl bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] active:scale-95 transition-all">HAPUS</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Confirm Modal */}
      {transactionToEdit && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-sm animate-pop text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-50 text-blue-500 rounded-full animate-bounce">
                <Edit2 size={32} />
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">Yakin mau diedit?</h4>
            <p className="text-sm font-bold text-slate-400 mb-8">Kamu akan mengubah rincian data transaksi ini.</p>
            <div className="flex gap-3">
              <button onClick={() => setTransactionToEdit(null)} className="flex-1 py-4 rounded-[2rem] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">BATAL</button>
              <button onClick={executeStartEdit} className={`flex-1 py-4 rounded-[2rem] font-black text-white shadow-xl bg-gradient-to-r ${theme.primary} hover:scale-[1.02] active:scale-95 transition-all`}>EDIT</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Saving Confirm Modal */}
      {savingToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-sm animate-pop text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-50 text-red-500 rounded-full animate-shake">
                <Trash2 size={32} />
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">Hapus Tabungan?</h4>
            <p className="text-sm font-bold text-slate-400 mb-8">Data tabungan "{savingToDelete.name}" akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setSavingToDelete(null)} className="flex-1 py-4 rounded-[2rem] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">BATAL</button>
              <button onClick={executeDeleteSaving} className="flex-1 py-4 rounded-[2rem] font-black text-white shadow-xl bg-gradient-to-r from-red-500 to-rose-600 hover:scale-[1.02] active:scale-95 transition-all">HAPUS</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Saving Confirm Modal */}
      {savingToEditConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-sm animate-pop text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-50 text-blue-500 rounded-full animate-bounce">
                <Edit2 size={32} />
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2">Edit Tabungan?</h4>
            <p className="text-sm font-bold text-slate-400 mb-8">Ubah nominal tabungan "{savingToEditConfirm.name}".</p>
            <div className="flex gap-3">
              <button onClick={() => setSavingToEditConfirm(null)} className="flex-1 py-4 rounded-[2rem] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">BATAL</button>
              <button onClick={executeStartEditSaving} className={`flex-1 py-4 rounded-[2rem] font-black text-white shadow-xl bg-gradient-to-r ${theme.primary} hover:scale-[1.02] active:scale-95 transition-all`}>LANJUT</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Saving Modal */}
      {editingSavingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-sm animate-pop">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-black text-slate-800">Update Terkumpul ✨</h4>
              <button onClick={() => setEditingSavingId(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">Rp</span>
                <input
                  type="text"
                  value={editSavingFormData.current}
                  onChange={(e) => setEditSavingFormData({ current: formatNumberWithDots(e.target.value) })}
                  className="w-full pl-14 pr-6 py-4 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-slate-200 outline-none font-black text-2xl text-slate-800"
                />
              </div>
              <button onClick={saveEditSaving} className={`w-full py-4 rounded-[2rem] font-black text-white shadow-xl bg-gradient-to-r ${theme.primary} hover:scale-[1.02] active:scale-95 transition-all`}>SIMPAN</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-md animate-pop">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-black text-slate-800">Edit Transaksi</h4>
              <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input type="date" value={editFormData.date} onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })} className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 outline-none font-bold text-xs" />
                <select value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 outline-none font-bold text-xs">
                  {categories.filter(c => c.type === editFormData.type).map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">Rp</span>
                <input
                  type="text"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: formatNumberWithDots(e.target.value) })}
                  className="w-full pl-14 pr-6 py-4 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-slate-200 outline-none font-black text-2xl"
                />
              </div>
              {editFormData.type === 'expense' && (
                <input type="text" value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} placeholder="Beli apa?" className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 outline-none font-bold text-slate-600" required />
              )}

              {editFormData.type === 'expense' && (
                <div className="grid grid-cols-6 gap-1">
                  {moodList.map((m) => (
                    <button key={m.label} type="button" onClick={() => setEditFormData({ ...editFormData, mood: m.label })} className={`p-2 rounded-xl text-xl transition-all ${editFormData.mood === m.label ? 'bg-white shadow-md scale-110 ring-2 ring-slate-100' : 'bg-slate-50 opacity-60'}`}>
                      {m.emoji}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={saveEdit} className={`w-full py-4 rounded-[2rem] font-black text-white shadow-xl bg-gradient-to-r ${editFormData.type === 'income' ? 'from-emerald-400 to-teal-500' : theme.primary}`}>SIMPAN PERUBAHAN</button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white/90 backdrop-blur-xl border border-white/50 p-2 rounded-[2.5rem] shadow-2xl flex justify-around items-center z-[100]">
        <NavButton active={activeTab === 'home' && !showSettings} icon={LayoutDashboard} label="TRANSAKSI" onClick={() => { setActiveTab('home'); setShowSettings(false); }} theme={theme} />
        <NavButton active={activeTab === 'analysis' && !showSettings} icon={PieChart} label="Laporan" onClick={() => { setActiveTab('analysis'); setShowSettings(false); }} theme={theme} />
        <NavButton active={activeTab === 'savings' && !showSettings} icon={Star} label="HOPE" onClick={() => { setActiveTab('savings'); setShowSettings(false); }} theme={theme} />
        <NavButton active={showSettings} icon={Settings} label="PENGATURAN" onClick={() => setShowSettings(!showSettings)} theme={theme} />
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500;700;900&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const NavButton = ({ active, icon: Icon, label, onClick, theme }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-[2rem] transition-all duration-300 ${active ? theme.secondary + ' text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600 hover:scale-105 active:scale-95'}`}>
    <Icon size={20} strokeWidth={active ? 3 : 2} fill={active ? 'currentColor' : 'none'} />
    <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'block' : 'hidden'}`}>{label}</span>
  </button>
);

const TransactionItem = ({ t, moodList, formatCurrency, deleteTransaction, startEdit, theme, categories }) => {
  const cat = categories.find(c => c.name === t.category);
  return (
    <div className="group flex items-center justify-between p-5 rounded-[2rem] bg-white border border-slate-50 hover:border-slate-200 transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center text-xl ${theme.light}`}>
          {t.type === 'income' ? '💰' : (moodList.find(m => m.label === t.mood)?.emoji || '💸')}
        </div>
        <div>
          <h4 className="font-black text-slate-800 text-sm">{t.description}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            {cat?.image ? <img src={cat.image} alt={cat.name} className="w-3.5 h-3.5 rounded-full object-cover shadow-sm" /> : <Star size={10} fill="currentColor" className="text-amber-400" />}
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.category} • {t.date}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className={`text-sm font-black ${t.type === 'income' ? 'text-emerald-500' : theme.accent}`}>
          {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount).replace('Rp', '')}
        </p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={() => startEdit(t)} className="p-2 text-slate-200 hover:text-blue-500 transition-all"><Edit2 size={16} /></button>
          <button onClick={() => deleteTransaction(t)} className="p-2 text-slate-200 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, theme }) => (
  <div className={`p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl transition-all hover:scale-105 ${theme}`}>
    <div className="flex justify-between items-center mb-2 sm:mb-4">
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-80">{title}</span>
      <Icon size={16} className="opacity-80 sm:w-5 sm:h-5" />
    </div>
    <h2 className="text-lg sm:text-2xl font-black tracking-tighter truncate">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}</h2>
  </div>
);

export default App;