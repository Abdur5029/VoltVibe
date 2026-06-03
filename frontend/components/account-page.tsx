'use client'

import { useState, useEffect } from 'react'
import { User, MapPin, CreditCard, Shield, Package, Edit2, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AccountTab = 'profile' | 'addresses' | 'payment' | 'security' | 'orders'

interface AccountPageProps {
  session: any
}

export function AccountPage({ session }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || 'John Doe',
    email: session?.user?.email || 'john.doe@example.com',
    phone: ''
  })
  const [editForm, setEditForm] = useState(profileData)

  const [addresses, setAddresses] = useState<any[]>([])
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ title: '', name: '', street: '', city: '', country: '' })

  const [cards, setCards] = useState<any[]>([])
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCard, setNewCard] = useState({ type: 'Credit', brand: 'MasterCard', last4: '', holder: '', expires: '' })

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/api/users/${userId}/`)
      .then(res => res.json())
      .then(data => {
        if(data.email) {
          const name = `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username;
          setProfileData({
            name,
            email: data.email,
            phone: data.phone || ''
          });
          setEditForm({
            name,
            email: data.email,
            phone: data.phone || ''
          });
        }
      });

    fetch(`http://localhost:8000/api/addresses/?user=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAddresses(data);
      });

    fetch(`http://localhost:8000/api/payments/?user=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCards(data);
      });
  }, [userId]);

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your settings, addresses, and track your orders.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-[var(--surface-container)] rounded-2xl border border-[var(--outline-variant)] p-4 sticky top-24">
              <nav className="flex flex-col gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--primary)]/20 text-[var(--primary)] shadow-[0_0_15px_rgba(0,212,255,0.15)] ring-1 ring-[var(--primary)]/50'
                          : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)] hover:text-[var(--on-surface)]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

              <div className="mt-8 pt-4 border-t border-[var(--outline-variant)]">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => window.location.href = '/api/auth/signout'}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-[var(--surface-container)] rounded-2xl border border-[var(--outline-variant)] p-6 md:p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-foreground">{profileData.name}</h1>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (isEditingProfile) {
                          // Cancel
                          setEditForm(profileData)
                        }
                        setIsEditingProfile(!isEditingProfile)
                      }}
                      className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      {isEditingProfile ? (
                        <input 
                          type="text" 
                          className="w-full bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                      ) : (
                        <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg px-4 py-3 text-foreground font-medium">
                          {profileData.name}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      {isEditingProfile ? (
                        <input 
                          type="email" 
                          className="w-full bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" 
                          value={editForm.email} 
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                      ) : (
                        <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg px-4 py-3 text-foreground font-medium">
                          {profileData.email}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      {isEditingProfile ? (
                        <input 
                          type="tel" 
                          className="w-full bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" 
                          placeholder="+1 (555) 000-0000" 
                          value={editForm.phone} 
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                      ) : (
                        <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-lg px-4 py-3 text-foreground font-medium">
                          {profileData.phone || <span className="text-muted-foreground italic">Not provided</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => {
                          if (!userId) return;
                          const [first_name, ...rest] = editForm.name.split(' ');
                          const last_name = rest.join(' ');
                          fetch(`http://localhost:8000/api/users/${userId}/`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              first_name,
                              last_name,
                              phone: editForm.phone
                            })
                          }).then(res => {
                            if (res.ok) {
                              setProfileData(editForm)
                              setIsEditingProfile(false)
                            } else {
                              alert("Failed to save profile changes")
                            }
                          });
                        }}
                        className="btn-dynamic bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Saved Addresses</h2>
                      <p className="text-muted-foreground text-sm">Manage where we ship your orders.</p>
                    </div>
                    {!isAddingAddress && (
                      <Button onClick={() => setIsAddingAddress(true)} className="btn-dynamic bg-[var(--primary)] text-[var(--on-primary)] shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Address
                      </Button>
                    )}
                  </div>

                  {isAddingAddress ? (
                    <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4">Add a new address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Title (e.g. Home, Office)" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newAddress.title} onChange={e => setNewAddress({...newAddress, title: e.target.value})} />
                        <input type="text" placeholder="Full Name" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                        <input type="text" placeholder="Street Address" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2 md:col-span-2" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                        <input type="text" placeholder="City, State, Zip" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                        <input type="text" placeholder="Country" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                        <Button onClick={() => {
                          if (!userId) return;
                          fetch(`http://localhost:8000/api/addresses/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              user: userId,
                              title: newAddress.title,
                              name: newAddress.name,
                              street: newAddress.street,
                              city: newAddress.city,
                              country: newAddress.country,
                              isDefault: addresses.length === 0
                            })
                          }).then(res => res.json()).then(data => {
                            setAddresses([...addresses, data])
                            setNewAddress({ title: '', name: '', street: '', city: '', country: '' })
                            setIsAddingAddress(false)
                          })
                        }} className="btn-dynamic bg-[var(--primary)] text-[var(--on-primary)]">Save Address</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map(address => (
                        <div key={address.id} className={`card-hover relative rounded-xl border p-6 ${address.isDefault ? 'bg-[var(--surface-container-highest)] border-[var(--primary)]/50 glow-primary' : 'bg-[var(--surface-container-low)] border-[var(--outline-variant)] hover:border-[var(--primary)]/30'}`}>
                          {address.isDefault && (
                            <div className="absolute top-4 right-4 text-[var(--primary)]">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                          )}
                          {address.isDefault && <Badge className="mb-4 bg-[var(--primary)]/20 text-[var(--primary)]">Default Shipping</Badge>}
                          <h3 className="font-bold text-lg text-foreground mb-1">{address.title || 'Address'}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {address.name}<br />
                            {address.street}<br />
                            {address.city}<br />
                            {address.country}
                          </p>
                          <div className="flex items-center gap-3">
                            <button className="text-sm font-medium text-destructive hover:underline" onClick={() => {
                              fetch(`http://localhost:8000/api/addresses/${address.id}/`, { method: 'DELETE' }).then(res => {
                                if (res.ok) setAddresses(addresses.filter(a => a.id !== address.id))
                              })
                            }}>Remove</button>
                            {!address.isDefault && (
                              <>
                                <span className="text-[var(--outline)]">|</span>
                                <button className="text-sm font-medium text-[var(--primary)] hover:underline" onClick={() => {
                                  fetch(`http://localhost:8000/api/addresses/${address.id}/`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ isDefault: true })
                                  }).then(res => {
                                    if (res.ok) setAddresses(addresses.map(a => ({...a, isDefault: a.id === address.id})))
                                  })
                                }}>Set as Default</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div onClick={() => setIsAddingAddress(true)} className="card-hover border-2 border-dashed border-[var(--outline)] hover:border-[var(--primary)] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--surface-container-low)]/50 transition-colors h-full min-h-[220px]">
                        <div className="w-12 h-12 rounded-full bg-[var(--surface-container-high)] flex items-center justify-center mb-3 text-[var(--muted-foreground)]">
                          <Plus className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground">Add New Address</h3>
                        <p className="text-sm text-muted-foreground mt-1">Ship to a different location</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
                      <p className="text-muted-foreground text-sm">Manage your debit and credit cards.</p>
                    </div>
                    {!isAddingCard && (
                      <Button onClick={() => setIsAddingCard(true)} className="btn-dynamic bg-[var(--primary)] text-[var(--on-primary)] shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Card
                      </Button>
                    )}
                  </div>

                  {isAddingCard ? (
                    <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-4">Add a new card</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <select className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newCard.type} onChange={e => setNewCard({...newCard, type: e.target.value})}>
                          <option>Credit</option>
                          <option>Debit</option>
                        </select>
                        <select className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newCard.brand} onChange={e => setNewCard({...newCard, brand: e.target.value})}>
                          <option>VISA</option>
                          <option>MasterCard</option>
                          <option>AMEX</option>
                        </select>
                        <input type="text" placeholder="Card Number" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2 md:col-span-2" onChange={e => setNewCard({...newCard, last4: e.target.value.slice(-4)})} />
                        <input type="text" placeholder="Card Holder Name" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newCard.holder} onChange={e => setNewCard({...newCard, holder: e.target.value})} />
                        <input type="text" placeholder="MM/YY" className="bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-2" value={newCard.expires} onChange={e => setNewCard({...newCard, expires: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddingCard(false)}>Cancel</Button>
                        <Button onClick={() => {
                          const match = newCard.expires.match(/^(\d{2})\/(\d{2})$/);
                          if (!match) {
                            alert("Please enter expiry in MM/YY format");
                            return;
                          }
                          const month = parseInt(match[1], 10);
                          const year = parseInt(match[2], 10) + 2000;
                          if (month < 1 || month > 12) {
                            alert("Invalid month");
                            return;
                          }
                          const now = new Date();
                          const currentYear = now.getFullYear();
                          const currentMonth = now.getMonth() + 1;
                          if (year < currentYear || (year === currentYear && month < currentMonth)) {
                            alert("This card has expired and cannot be added.");
                            return;
                          }
                          if (!userId) return;
                          fetch(`http://localhost:8000/api/payments/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              user: userId,
                              card_type: newCard.type,
                              brand: newCard.brand,
                              last4: newCard.last4 || '1234',
                              holder: newCard.holder,
                              expires: newCard.expires,
                              isDefault: cards.length === 0
                            })
                          }).then(res => res.json()).then(data => {
                            setCards([...cards, data])
                            setNewCard({ type: 'Credit', brand: 'MasterCard', last4: '', holder: '', expires: '' })
                            setIsAddingCard(false)
                          })
                        }} className="btn-dynamic bg-[var(--primary)] text-[var(--on-primary)]">Save Card</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cards.map(card => (
                        <div key={card.id} className={`card-hover bg-gradient-to-br ${card.brand === 'VISA' ? 'from-slate-800 to-slate-900' : card.brand === 'MasterCard' ? 'from-orange-900 to-red-900' : 'from-blue-900 to-indigo-900'} rounded-2xl border ${card.isDefault ? 'border-[var(--primary)] shadow-[0_0_15px_rgba(0,212,255,0.2)]' : 'border-slate-700'} p-6 relative overflow-hidden shadow-xl`}>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                          <div className="flex justify-between items-center mb-8 relative z-10">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-6 bg-slate-200/80 rounded-sm" />
                              <span className="font-bold text-white tracking-wider">{card.type}</span>
                            </div>
                            <div className="text-white font-bold text-xl italic">{card.brand}</div>
                          </div>
                          <div className="text-slate-300 font-mono text-lg tracking-widest mb-4 relative z-10">
                            **** **** **** {card.last4}
                          </div>
                          <div className="flex justify-between items-end relative z-10">
                            <div>
                              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Card Holder</p>
                              <p className="text-white font-medium uppercase">{card.holder}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Expires</p>
                              <p className="text-white font-medium">{card.expires}</p>
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2 z-20">
                            {card.isDefault && <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">Default</Badge>}
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/10 flex justify-end gap-4 relative z-10">
                            {!card.isDefault && (
                              <button className="text-xs text-white/70 hover:text-white" onClick={() => {
                                fetch(`http://localhost:8000/api/payments/${card.id}/`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ isDefault: true })
                                }).then(res => {
                                  if (res.ok) setCards(cards.map(c => ({...c, isDefault: c.id === card.id})))
                                })
                              }}>Set Default</button>
                            )}
                            <button className="text-xs text-red-400 hover:text-red-300" onClick={() => {
                              fetch(`http://localhost:8000/api/payments/${card.id}/`, { method: 'DELETE' }).then(res => {
                                if (res.ok) setCards(cards.filter(c => c.id !== card.id))
                              })
                            }}>Remove</button>
                          </div>
                        </div>
                      ))}

                      <div onClick={() => setIsAddingCard(true)} className="card-hover border-2 border-dashed border-[var(--outline)] hover:border-[var(--primary)] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-[var(--surface-container-low)]/50 transition-colors h-full min-h-[200px]">
                        <div className="w-12 h-12 rounded-full bg-[var(--surface-container-high)] flex items-center justify-center mb-3 text-[var(--muted-foreground)]">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground">Add Payment Method</h3>
                        <p className="text-sm text-muted-foreground mt-1">Debit, Credit, or PayPal</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>
                    <p className="text-muted-foreground text-sm">Keep your account safe and secure.</p>
                  </div>

                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-xl p-6">
                      <h3 className="font-bold text-lg text-foreground mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                          <input type="password" className="w-full bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">New Password</label>
                          <input type="password" className="w-full bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
                          <input type="password" className="w-full bg-[var(--surface-container-high)] border border-[var(--outline)] rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all" />
                        </div>
                        <Button className="btn-dynamic mt-2">Update Password</Button>
                      </div>
                    </div>

                    <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-1">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                      </div>
                      <Button variant="outline" className="border-[var(--primary)] text-[var(--primary)] whitespace-nowrap">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Order History</h2>
                    <p className="text-muted-foreground text-sm">View and track your previous purchases.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Empty State / Fake Order */}
                    <div className="bg-[var(--surface-container-low)] border border-[var(--outline-variant)] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[var(--primary)]/30 transition-colors">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-16 h-16 bg-[var(--surface-container-high)] rounded-lg flex items-center justify-center flex-shrink-0 border border-[var(--outline)]">
                          <Package className="w-8 h-8 text-[var(--muted-foreground)]" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Order #VLT-847291</p>
                          <h3 className="font-bold text-foreground">Sony WH-1000XM5</h3>
                          <p className="text-sm text-[var(--success)] font-medium mt-1">Delivered on May 15, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="text-right flex-grow">
                          <p className="font-bold text-lg text-foreground">$398.00</p>
                          <p className="text-xs text-muted-foreground">1 item</p>
                        </div>
                        <Button variant="outline" className="flex-shrink-0">View Details</Button>
                      </div>
                    </div>

                    <div className="text-center py-12 border-2 border-dashed border-[var(--outline-variant)] rounded-xl">
                      <Package className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground">No more orders</h3>
                      <p className="text-muted-foreground mt-2">When you place orders, they will appear here.</p>
                      <Button className="mt-6 btn-dynamic bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--on-primary)]">
                        Start Shopping
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  )
}
