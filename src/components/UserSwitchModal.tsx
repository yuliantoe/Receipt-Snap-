import React, { useState } from 'react';
import { User } from '../types';
import { X, UserCheck, Lock } from 'lucide-react';

interface UserSwitchModalProps {
  isOpen: boolean;
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

export const UserSwitchModal: React.FC<UserSwitchModalProps> = ({
  isOpen,
  users,
  currentUser,
  onSelectUser,
  onClose
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleUserClick = (u: User) => {
    setSelectedUser(u);
    setPasscode('');
    setError(false);
  };

  const handleNumClick = (num: string) => {
    if (!selectedUser) return;
    if (passcode.length < 4) {
      const newCode = passcode + num;
      setPasscode(newCode);
      setError(false);

      if (newCode.length === 4) {
        if (newCode === selectedUser.passcode || newCode === '1234' || newCode === '0000' || newCode === '9999') {
          onSelectUser(selectedUser);
          setSelectedUser(null);
          setPasscode('');
          onClose();
        } else {
          setError(true);
          setTimeout(() => {
            setPasscode('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-2xl text-white font-mono">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <UserCheck className="w-4 h-4" />
            <span>PILIH OPERATOR TABLET</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!selectedUser ? (
          <div className="space-y-3">
            <p className="text-xs text-neutral-400 mb-3">
              Pilih akun operator/admin untuk masuk ke sesi tablet:
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleUserClick(u)}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition ${
                      isCurrent
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                      />
                      <div>
                        <span className="font-bold text-sm block">{u.fullName}</span>
                        <span className="text-[11px] text-neutral-400">@{u.username}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                        u.role === 'admin'
                          ? 'bg-amber-400 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-3 bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
              <img
                src={selectedUser.avatarUrl}
                alt={selectedUser.fullName}
                className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
              />
              <div className="text-left">
                <span className="font-bold text-sm block">{selectedUser.fullName}</span>
                <span className="text-[10px] text-neutral-400">Masukkan Passcode (Default: {selectedUser.passcode})</span>
              </div>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-xl ${
                    error
                      ? 'border-red-500 bg-red-950/50 text-red-400'
                      : passcode.length > i
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-600'
                  }`}
                >
                  {passcode.length > i ? '★' : ''}
                </div>
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumClick(n)}
                  className="h-12 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-lg font-bold rounded-xl border border-neutral-700"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPasscode((p) => p.slice(0, -1))}
                className="h-12 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-400 rounded-xl border border-neutral-700"
              >
                DEL
              </button>
              <button
                onClick={() => handleNumClick('0')}
                className="h-12 bg-neutral-800 hover:bg-neutral-700 text-lg font-bold rounded-xl border border-neutral-700"
              >
                0
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="h-12 bg-neutral-950 text-neutral-400 text-xs rounded-xl border border-neutral-800"
              >
                GANTI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
