// Estensione del progetto React: modulo Clienti + modulo Brevetti con ricerca, upload e alert
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fakeUsers = [{ username: 'admin', password: 'admin' }];

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = fakeUsers.find(u => u.username === username && u.password === password);
    if (user) onLogin();
    else alert('Credenziali errate');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[300px]">
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Login</h2>
          <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="w-full" onClick={handleLogin}>Accedi</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Clienti({ clienti, setClienti }) {
  const [form, setForm] = useState({
    nome: '', codiceFiscale: '', indirizzo: '', telefono: '', fax: '', web: '', email: '', pec: '', sdi: '', note: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCliente = () => {
    const nuovoCliente = { id: clienti.length + 1, ...form };
    setClienti([...clienti, nuovoCliente]);
    setForm({ nome: '', codiceFiscale: '', indirizzo: '', telefono: '', fax: '', web: '', email: '', pec: '', sdi: '', note: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Aggiungi Cliente</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <Input key={key} name={key} value={value} onChange={handleChange} placeholder={key} />
        ))}
      </div>
      <Button className="mt-4" onClick={handleAddCliente}>Salva Cliente</Button>

      <h2 className="text-xl font-bold mt-8">Elenco Clienti</h2>
      <ul className="mt-2">
        {clienti.map(c => (
          <li key={c.id}>{c.id}. {c.nome} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
}

function Brevetti({ clienti }) {
  const [brevetti, setBrevetti] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    numeroDeposito: '', dataDeposito: '', titolo: '',
    titolare: '', inventore: '', numeroPriorita: '', dataPriorita: '',
    statoPriorita: '', dataRapporto: '', dataPubblicazione: '',
    dataConcessione: '', stato: '', note: '', stessaFamiglia: '', upload: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateDates = (dataDeposito, dataPriorita) => {
    const depositoDate = new Date(dataDeposito);
    const prioritaDate = dataPriorita ? new Date(dataPriorita) : depositoDate;
    const dataPubblicazione = new Date(prioritaDate);
    dataPubblicazione.setMonth(dataPubblicazione.getMonth() + 18);
    const prossimaAnnualita = new Date(depositoDate);
    prossimaAnnualita.setFullYear(prossimaAnnualita.getFullYear() + 4);
    prossimaAnnualita.setMonth(prossimaAnnualita.getMonth() + 1);
    prossimaAnnualita.setDate(0);
    const scadenza = new Date(depositoDate);
    scadenza.setFullYear(scadenza.getFullYear() + 20);
    return {
      dataPubblicazione: dataPubblicazione.toISOString().split('T')[0],
      prossimaAnnualita: prossimaAnnualita.toISOString().split('T')[0],
      dataScadenza: scadenza.toISOString().split('T')[0]
    };
  };

  const handleAddBrevetto = () => {
    const year = new Date(form.dataDeposito).getFullYear();
    const countAnno = brevetti.filter(b => new Date(b.dataDeposito).getFullYear() === year).length + 1;
    const idProgressivo = `${countAnno}_${year} BI`;
    const { dataPubblicazione, prossimaAnnualita, dataScadenza } = calculateDates(form.dataDeposito, form.dataPriorita);
    const nuovoBrevetto = { id: idProgressivo, ...form, dataPubblicazione, prossimaAnnualita, dataScadenza };
    setBrevetti([...brevetti, nuovoBrevetto]);
    setForm({ numeroDeposito: '', dataDeposito: '', titolo: '', titolare: '', inventore: '', numeroPriorita: '', dataPriorita: '', statoPriorita: '', dataRapporto: '', dataPubblicazione: '', dataConcessione: '', stato: '', note: '', stessaFamiglia: '', upload: '' });
  };

  const handleUpload = e => {
    const file = e.target.files[0];
    if (file) alert(`File caricato: ${file.name}`);
  };

  const brevettiFiltrati = brevetti.filter(b =>
    Object.values(b).some(val => val && val.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Aggiungi Brevetto</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          key !== 'upload' ?
            <Input key={key} name={key} value={value} onChange={handleChange} placeholder={key} /> :
            <input key={key} type="file" name={key} onChange={handleUpload} />
        ))}
      </div>
      <Button className="mt-4" onClick={handleAddBrevetto}>Salva Brevetto</Button>

      <h2 className="text-xl font-bold mt-8">Cerca Brevetti</h2>
      <Input className="mb-4" placeholder="Cerca per nome, parola chiave, numero o data" value={search} onChange={e => setSearch(e.target.value)} />

      <h2 className="text-xl font-bold">Elenco Brevetti</h2>
      <ul className="mt-2">
        {brevettiFiltrati.map(b => (
          <li key={b.id}>{b.id} - {b.titolo}</li>
        ))}
      </ul>
    </div>
  );
}

function Dashboard() {
  const [clienti, setClienti] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Brevetti</h1>
      <Clienti clienti={clienti} setClienti={setClienti} />
      <Brevetti clienti={clienti} />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
