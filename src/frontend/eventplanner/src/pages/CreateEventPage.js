import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Modal, Container, Card } from 'react-bootstrap';

import './CreateEventPage.css';

import EditMapPage from './EditMapPage';
import axios from 'axios';
import RichTextEditor from '../components/RichTextEditor';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import AktivnostForm from '../components/AktivnostForm';

import MapModal from '../components/MapModal';
import Cenovnik from '../components/Cenovnik';

import config from '../config';

function CreateEventPage() {
  const [naziv, setNaziv] = useState('');
  const [datumPocetka, setDatumPocetka] = useState('');
  const [datumZavrsetka, setDatumZavrsetka] = useState('');
  const [opis, setOpis] = useState('');
  const [kategorija, setKategorija] = useState('');
  //const [napomene, setNapomene] = useState('');
  const [kapacitet, setKapacitet] = useState('');
  const [greska, setGreska] = useState('');
  const [uspeh, setUspeh] = useState('');
  const [dani, setDani] = useState([]);
  const [lokacija, setLokacija] = useState('');
  const [slika, setSlika] = useState(null);
  const [resursUnos, setResursUnos] = useState({ naziv: '', tip: '', kolicina: '' });
  const [aktivnostUnos, setAktivnostUnos] = useState({ naziv: '', opis: '', vremePocetka: '', vremeZavrsetka: '', tacka:null });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trenutniDanIndex, setTrenutniDanIndex] = useState(null);
  const [aktivnaForma, setAktivnaForma] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [aktivniDanIndex, setAktivniDanIndex] = useState(null);
  const [odabraniDanIndexZaMapi, setOdabraniDanIndexZaMapi] = useState(0)
  const [dayMapModalOpen, setDayMapModalOpen] = useState(false)
  const [cenovnik, setCenovnik] = useState(null);
  const [cenovnikStavke, setCenovnikStavke] = useState([]);
  const [showCenovnik, setShowCenovnik] = useState(false);
  const token = localStorage.getItem("token")
  const organizatorId = localStorage.getItem('organizatorId');
  console.log(organizatorId);
  const tipoviNapomena = ["Ulaz", "Ponasanje"]
  const tipoviDogadjaja = ["Konferencija", "Utakmica", "Protest", "Festival", "Zurka", "Vasar"]//Ovo je samo trenutno radi testiranja, trebalo bi prvo da se proveri sa backendom.... 
  const tipoviKarata = ["Regular", "VIP", "Besplatna", "RaniPristup"]
  const handleStavkeSubmit = (stavke)=>{
    setCenovnikStavke((prev) => [...prev, ...stavke]); 
    console.log('stavke:');
    console.log(stavke);
  }
  const handleClose= ()=>{
      setShowCenovnik(false);
      console.log('cenovnik');
      console.log(cenovnikStavke);
  }
  useEffect(()=>{
    console.log('Cenovnik stavke ucitane');
    console.log(cenovnikStavke);
  },[cenovnikStavke])
  const openMapForDay = (index) => {
    console.log('index')
    console.log(index);
    setOdabraniDanIndexZaMapi(index);
    setTimeout(() => {
      setDayMapModalOpen(true);
    }, 0);
    
  };

  const handleMapModalClose = (newFieldsForThatDay) => {

    setDani(prevDani => {
      const updated = [...prevDani];
      if (odabraniDanIndexZaMapi !== null) {
        updated[odabraniDanIndexZaMapi] = {
          ...updated[odabraniDanIndexZaMapi],
          fields: newFieldsForThatDay,
        };
      }
      return updated;
    });

    console.log(dani);
    console.log(newFieldsForThatDay)
    setDayMapModalOpen(false);
    setOdabraniDanIndexZaMapi(null);
};
  
  const kreirajDogadjaj = async () => {
    console.log(datumPocetka)
    //const CistOpis = opis.replace(/<[^>]*>/g, '');
    const kreirajDogadjajDto = {
      naziv: naziv,
      lokacija: lokacija,       
      datumPocetka: datumPocetka,
      datumKraja: datumZavrsetka,
      urLalbuma: '',                                
      opis: CistOpis,
      kapacitet: 125,
      tagovi: ["t1"],
      organizatorId: organizatorId,
      status: 'upcoming',
      kategorija: kategorija,
      napomene: [],
      resursi: []    
    }
    
    const response = await fetch(config.API_BASE_URL + 'api/dogadjaj/kreiraj',{
      method:'POST',
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kreirajDogadjajDto)
    })
    console.log(response);
    if(!response.ok){
      alert('Greska priliokm kreiranja dogadjaja')
    }
    else {
      const data = await response.json();
      console.log(data);
      dodajKarteZaDogadjaj(data.id)
      dodajDaneDogadjaja(data.id);
      dodajNapomeneUDogadjaj(data.id);
      dodajCenovnik(data.id);
      objaviSliku(data.id);
     // objaviPodrucja(data.id)
      setShowSuccessModal(true);
    }
    
    
  }
  const dodajKarteZaDogadjaj = async (id_dogadjaja) => {
    karte.forEach(async (karta)=>{
      const kartaDto ={
        naziv: karta.naziv,
        opis:'karta',
        heXboja:'#fff',
        tip:karta.tip,
        urlSlike:'temp',
        cena: karta.cena,
        brojKarata: karta.kolicina,
        dogadjajId: id_dogadjaja,
        danId: 'a1a1a1a1a1a1a1a1a1a1a1a1'
      }
      const response = await fetch(config.API_BASE_URL +'api/Karta',{
        method:'POST',
        headers:{
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kartaDto)
      });
      const data = await response.json();
      console.log(data);
    })
  }
  const dodajDaneDogadjaja = async (id_dogadjaja) =>{
    dani.forEach(async (dan, index)=>{
      const danDto = {
        naziv: 'Dan ' + index,
        opis: dan.opis,
        datumOdrzavanja: new Date(dan.datum),
        dogadjaj: id_dogadjaja,
        podrucja:[],
        aktivnosti: [],
      }
      const response = await fetch(config.API_BASE_URL +'api/dani/kreiraj',{
        method:'POST',
        headers:{
          Authorization:`Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(danDto)
      });
      const data = await response.json();
      console.log(dan);
      objaviPodrucja(id_dogadjaja, dan, data.id);
      dodajKarteZaDan(id_dogadjaja, dan, data.id);
      console.log(dan);
      console.log('DATUM POCETKA: ')
      console.log(dan.datumPocetka)
      dodajAktivnostiUDan(dan.aktivnosti, data.id, id_dogadjaja,dan.datum);
    })
  }
  const kreirajCenovnik = async(id) =>{
    let listaIda = [];
     cenovnikStavke.forEach(async(element) => {
        
    });
    for(const element of cenovnikStavke){
    const cenovnikStavkaDto = {
          naziv: element.naziv,
          opis: element.opis,
          cena: element.cena,
          kolicina: element.kolicina,
          uRLSlike: 'a',
          cenovnikId: 'a1a1a1a1a1a1a1a1a1a1a1',
        }
        const response = await fetch(config.API_BASE_URL +'api/cenovnik-stavke/kreiraj', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cenovnikStavkaDto) 
        });
        const rez = await response.json()
        console.log(rez);
        listaIda.push(rez.id);
        return listaIda;
    }
    
  }
  const dodajCenovnik = async(id)=>{
    const listaIda = await kreirajCenovnik();
    const cenovnikDto = {
      naziv: naziv,
      dogadjajId: id,
      stavkeIds: listaIda,
    }
    console.log('cenovnikDto:');
    console.log(cenovnikDto);
    const response = await fetch(config.API_BASE_URL + 'api/cenovnici',{
      method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cenovnikDto)
    })
    console.log(response);
  }


  const dodajKarteZaDan = async(id_dogadjaja, dan, danId)=>{
    karte.forEach(async (karta)=>{
      if(karta.danKarte == "Ceo dogadjaj" && (karta.kreirana == undefined || karta.kreirana == false)){
        karta.kreirana=true;
        console.log('lLLALALLALALAA');
        console.log(karta);
        const KartaDto = {
          naziv: karta.naziv,
          opis:'karta',
          heXboja:'#fff',
          tip:karta.tip,
          urlSlike:'temp',
          cena: karta.cena,
          brojKarata: karta.kolicina,
          dogadjajId: id_dogadjaja,
          danId: danId,
          brojDana: dani.length
        }
        const response = await fetch(config.API_BASE_URL +'api/Karta',{
          method:'POST',
          headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(KartaDto)
        });
      }
      if(karta.danKarte != dan.datum)return;
      const KartaDto = {
        naziv: karta.naziv,
        opis:'karta',
        heXboja:'#fff',
        tip:karta.tip,
        urlSlike:'temp',
        cena: karta.cena,
        brojKarata: karta.kolicina,
        dogadjajId: id_dogadjaja,
        danId: danId,
        brojDana: 1
      }
      const response = await fetch(config.API_BASE_URL +'api/Karta',{
      method:'POST',
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(KartaDto)
    });
    })
  }
  const dodajAktivnostiUDan = async(aktivnostiT, id_dana, id_dogadjaja,datum) => {
    aktivnostiT.forEach(async(aktt) =>  {
      const tempDate = new Date(datum);
      console.log('temp date')
      console.log(tempDate)
      console.log(aktt)
      const [startHours, startMinutes] = aktt.vremePocetka.split(':').map(Number)
      const [endHours, endMinutes] = aktt.vremeZavrsetka.split(':').map(Number)
      const lokacija = await kreirajLokaciju(id_dogadjaja, aktt.lokacija.name, 'opis', aktt.lokacija.position.lat, aktt.lokacija.position.lng);
      console.log("LOKACIJA")
      console.log(lokacija)
      const pocetak = new Date(tempDate) 
      pocetak.setHours(startHours, startMinutes, 0 , 0);
      const kraj = new Date(tempDate)
      kraj.setHours(endHours, endMinutes, 0 , 0);
      console.log("pocetak")
      console.log(pocetak)
      const aktDto = {
        naziv: aktt.naziv,
        opis: aktt.opis, 
        datumVremePocetka: pocetak,
        datumVremeKraja: kraj,
        dan: id_dana,
        dogadjaj: id_dogadjaja,
        tip: 0,
        lokacija:lokacija.id
      }
      console.log('AKT DTO:')
      console.log(aktDto)
      const response = await fetch(config.API_BASE_URL + 'api/aktivnosti/kreiraj',{
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method:'POST',
      body: JSON.stringify(aktDto)
      })
      const data = await response.json();
      console.log(data);
    })
    
  }
  const dodajNapomeneUDogadjaj = async (dogadjaj_id) => {
    napomene.forEach(async(napomena)=>{
      const napomenaDto = {
        sadrzaj: napomena.sadrzaj,
        tip: napomena.oznake,
        dogadjaj: dogadjaj_id,
      }
      const response = await fetch(config.API_BASE_URL + 'api/napomene/kreiraj',{
        method:'POST',
        headers:{
          Authorization:`Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(napomenaDto)
      })
    })
  }
  const kreirajLokaciju = async(dogadjaj_id, naziv, opisL, x , y) => {
    const lokacijaDto = {
      dogadjajId: dogadjaj_id,
      naziv: naziv,
      opis: opisL,
      xKoordinata: x,
      yKoordinata: y,
      urlSlikeMape: '/',
      cenovnikId: 'a1a1a1a1a1a1a1a1a1a1a1a1',
      podrucjeId: 'a1a1a1a1a1a1a1a1a1a1a1a1',
      hexBoja:"#fff"
    }
    const response = await fetch(config.API_BASE_URL + 'api/lokacije/kreiraj', {
      method:'POST',
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lokacijaDto)
    });
    if (!response.ok) {
      console.error("Greška prilikom kreiranja lokacije:", response.status, await response.text());
      throw new Error(`Kreiranje lokacije nije uspelo (status ${response.status})`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  }
  const objaviSliku = async (id_dogadjaja) => {
    const formData = new FormData()
    formData.append('slika', slika)
    formData.append('opis','opis_slike');
    formData.append('dogadjajId', id_dogadjaja);
    const response = await fetch(config.API_BASE_URL + 'api/dogadjaj/slika', {
      method:'POST',
      body:formData,
    });
    const data = await response.json();
    console.log('SAVED PATH: ', data.path);
  }
  const objaviPodrucja = async(id_dogadjaja, dan, dan_id) =>{
    console.log('dan:')
    console.log(dan);
    dan.fields.forEach(async(field)=>{
      const lokacijaDto = {
      dogadjajId: id_dogadjaja,
      naziv: field.name,
      opis: '',
      xKoordinata: field.mainLocation.coordinates.lat,
      yKoordinata: field.mainLocation.coordinates.lng,
      urlSlikeMape: '/',
      cenovnikId: 'a1a1a1a1a1a1a1a1a1a1a1a1',
      podrucjeId: 'a1a1a1a1a1a1a1a1a1a1a1a1',
      HEXboja:"#fff",
      tipLokacije: Number(field.mainLocation.type)
    }

    console.log('lokacijaDto')
    console.log(lokacijaDto);
    const response1 = await fetch(config.API_BASE_URL +'api/lokacije/kreiraj', {
      method:'POST',
      headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lokacijaDto)
    })
    const data = await response1.json();
      const listCoords = [];
      let j = 0;
      const listLoc = []
      listLoc[0] = data.id
      const totalList = field.polygon.map(p => [p.lat, p.lng]);
      const podrucjeDto = {
        dogadjajId: id_dogadjaja,
        danId: dan_id,
        naziv: field.name,
        lokacije: listLoc,
        Koordinate: totalList,
      }
      const response = await fetch(config.API_BASE_URL + 'api/podrucja',{
        method:'POST',
        headers:{
          Authorization:`Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(podrucjeDto),
      })
      const data2 = await response.json();
      console.log(data2);
    })
  }
  const [napomene, setNapomene] = useState([
    {dogadjajId:'', sadrzaj:'', oznake:'',datumDodavanja:''}
  ])

  const handleNapomeneChange = (index, field, value) =>{
    const updatedNapomene = [...napomene];
    updatedNapomene[index][field] = value;
    setNapomene(updatedNapomene)
  }

  const dodajNapomenu = () => {
    setNapomene([...napomene, {dogadjajId:'', sadrzaj:'', oznake:'', datumDodavanja:''}])
  }

  const [karte, setKarte] = useState([
    {naziv:'', tip:'', cena:'', kolicina:''}
  ]);
    
  const handleKarteChange = (index, field, value) => {
    if(value < 0) value = value * (-1)
    const updatedKarte = [...karte];
    updatedKarte[index][field] = value;
    setKarte(updatedKarte);
  }

  const dodajKartu = () =>{
    setKarte([...karte,{naziv:'', tip:'', cena:'', kolicina:''}]);
  };

  // Za aktivonisti=========================

  const dajDatumeIzmedju = (pocetni, zavrsni) => {
    const datumi = []
    let trenutni = new Date(pocetni)
    const poslednji = new Date(zavrsni)

    while(trenutni <= poslednji){
      datumi.push(new Date(trenutni).toISOString().split('T')[0])
      trenutni.setDate(trenutni.getDate() + 1)
    }
    return datumi;
  }


  const LocationPicker = ({onselect}) =>{
    useMapEvents({
       click(e){
        onselect(e.latlng)
       }
    })
    return null;
  }

  const [aktivnosti, setAktivnosti] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectLatLng, setSelectedLatLng] = useState(null)
  const [indexTrenutneAktivnosti, setIndexTrenutneAktivnosti] = useState(null)

  const dodajAktivnost = () => {
    setAktivnosti([...aktivnosti, {'naziv':'', location:null}]);
  }

  const handlePromenaNazivaAktivnosti = (index, naziv) => {
    const noveAktivnosti = [...aktivnosti];
    noveAktivnosti[index].naziv = naziv;
    setAktivnosti(noveAktivnosti)
  }

  const prikaziMapu = (index) => {
    setIndexTrenutneAktivnosti(index);
    setShowModal(true);
  }

  const handleKlikNaMapi = (latlng) => {
    setSelectedLatLng(latlng);
  }

  const sacuvajLokaciju = () => {
    const noveAktivnosti = [...aktivnosti]
    noveAktivnosti[indexTrenutneAktivnosti].lokacija = selectLatLng
    setAktivnosti(noveAktivnosti)
    setShowModal(false);
  };

  

  useEffect(() => {
    if (!datumPocetka || !datumZavrsetka) {
      setDani([]);
      return;
    }

    const pocetak = new Date(datumPocetka);
    const kraj = new Date(datumZavrsetka);

    if (kraj < pocetak) {
      setDani([]);
      return;
    }

    const diffTime = Math.abs(kraj - pocetak);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    

    const noviDani = [];
    for (let i = 0; i < diffDays; i++) {
      const datum = new Date(pocetak);
      datum.setDate(pocetak.getDate() + i);
      noviDani.push({
        id: Date.now() + i,
        datum: datum.toISOString().substring(0, 10),
        nazivLokacije: `Dan ${i + 1}`,
        latituda: 0,
        longituda: 0,
        opis: '',
        resursi: [],
        tacke: [],
        aktivnosti: [],  // dodao aktivnosti polje za svaki dan
        fields:[]
      });
    }
    setDani(noviDani);
    setTrenutniDanIndex(null);
    setResursUnos({ naziv: '', tip: '', kolicina: '' });
    setAktivnostUnos({ naziv: '', opis: '', vremePocetka: '', vremeZavrsetka: '' });
    setAktivnaForma(null);
  }, [datumPocetka, datumZavrsetka]);

  const dodajResursUDan = (danIndex) => {
    if (!resursUnos.naziv.trim() || !resursUnos.tip.trim() || !resursUnos.kolicina.trim()) {
      alert('Popunite sva polja za resurs.');
      return;
    }

    const noviDani = [...dani];
    noviDani[danIndex].resursi.push({
      id: Date.now(),
      naziv: resursUnos.naziv.trim(),
      tip: resursUnos.tip.trim(),
      kolicina: resursUnos.kolicina.trim(),
    });
    setDani(noviDani);
    setResursUnos({ naziv: '', tip: '', kolicina: '' });
    setTrenutniDanIndex(null);
    setAktivnaForma(null);
  };

  const dodajAktivnostUDan = (danIndex) => {
    if (!aktivnostUnos.naziv.trim() || !aktivnostUnos.vremePocetka.trim() || !aktivnostUnos.vremeZavrsetka.trim()) {
      alert('Popunite naziv i vreme aktivnosti.');
      return;
    }

    const noviDani = [...dani];
    noviDani[danIndex].aktivnosti.push({
      id: Date.now(),
      naziv: aktivnostUnos.naziv.trim(),
      opis: aktivnostUnos.opis.trim(),
      vremePocetka: aktivnostUnos.vremePocetka,
      vremeZavrsetka: aktivnostUnos.vremeZavrsetka,
      lokacija: aktivnostUnos.lokacija
    })
    console.log('AKT:');
    console.log(aktivnostUnos);
    setDani(noviDani);
    setAktivnostUnos({ naziv: '', opis: '', vremePocetka: '', vremeZavrsetka: '' });
    setTrenutniDanIndex(null);
    setAktivnaForma(null);
  };
  
  const otvoriMapu = (danIndex) => {
    setAktivniDanIndex(danIndex);
    setShowMapModal(true);
  };

  const zatvoriMapu = () => {
    setShowMapModal(false);
    setAktivniDanIndex(null);
  };

  const sacuvajMapu = (azuriraniDan) => {
    const noviDani = [...dani];
    noviDani[aktivniDanIndex] = azuriraniDan;
    setDani(noviDani);
    zatvoriMapu();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreska('');
    setUspeh('');

    if (!naziv.trim() || !datumPocetka || !datumZavrsetka || !kategorija) {
      setGreska('Molimo popunite sva obavezna polja.');
      return;
    }

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
    

    const Dani = dani.map((dan, i) => ({
      datum: dan.datum,
      nazivLokacije: dan.nazivLokacije || `Dan ${i + 1}`,
      latituda: dan.latituda || 0,
      longituda: dan.longituda || 0,
      opis: dan.opis || '',
      resursi: dan.resursi.map(r => ({
        naziv: r.naziv,
        tip: r.tip,
        kolicina: parseInt(r.kolicina) || 0
      })),
      tacke: dan.tacke || [],
      aktivnosti: dan.aktivnosti || [],
    }));

    const noviDogadjaj = {
      naziv,
      datumPocetka,
      datumZavrsetka,
      opis,
      kategorija,
      napomene,
      maxBrojUcesnika: parseInt(kapacitet) || 0,
      organizatorId: '6867d06b660775a4039211af',
      slikaDogadjaja: {
        naziv: 'placeholder.jpg',
        putanjaDoSlike: '/images/placeholder.jpg'
      },
      dani: Dani,
      KarteDogadjaja: []
    };

    try {
      console.log(token);
      const response = await fetch(config.API_BASE_URL + 'api/dogadjaji/kreiraj', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noviDogadjaj),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Greška prilikom kreiranja događaja: ${errText}`);
      }

      setUspeh('Događaj je uspešno kreiran!');
      setNaziv('');
      setDatumPocetka('');
      setDatumZavrsetka('');
      setOpis('');
      setKategorija('');
      setNapomene('');
      setKapacitet('');
      setDani([]);
      setResursUnos({ naziv: '', tip: '', kolicina: '' });
      setAktivnostUnos({ naziv: '', opis: '', vremePocetka: '', vremeZavrsetka: '', lokacija:null });
      setTrenutniDanIndex(null);
      setAktivnaForma(null);
    } catch (error) {
      setGreska(error.message);
    }
  };

  return (
    <div className="create-event-container">
      {greska && <div className="error-message">{greska}</div>}
      {uspeh && <div className="success-message">{uspeh}</div>}
      
      <Container style={{borderRadius:'16px'}}>
        <fieldset className='p-3 mb-4'style={{backgroundColor: "#1F1B36"}}/**stil */> 
        <Form>
            <legend className='w-auto px-2'>Osnovne informacije</legend>
            <Form.Group className="mb-3" controlId="nazivDogadjaja">
              <Form.Label>Naziv događaja</Form.Label>
              <Form.Control
                style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                type="text"
                placeholder='Unesite naziv događaja'
                value={naziv}
                onChange={e => setNaziv(e.target.value)}
                className='placeholder-light' 
                required
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId="opisDogadjaja">
              <Form.Label>Opis događaja</Form.Label>
              <RichTextEditor content={opis} setContent={setOpis}></RichTextEditor>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Datum početka</Form.Label>
                  <Form.Control
                    style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                    className="dateInput"
                    type="datetime-local"
                    value={datumPocetka}
                    onChange={e => setDatumPocetka(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Datum završetka</Form.Label>
                  <Form.Control
                    style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                    className="dateInput"
                    type="datetime-local"
                    value={datumZavrsetka}
                    onChange={e => setDatumZavrsetka(e.target.value)}
                    required
                    
                    min={datumPocetka}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Tip događaja</Form.Label>
              <Form.Select 
              value={kategorija}
              onChange={e => setKategorija(e.target.value)}
              required
              style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
              >
                <option>Odaberite tip događaja</option>
                { tipoviDogadjaja.map(t => (
                  <option key={t} value={t}>{t}</option>
                )) }
              </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Naziv lokacije</Form.Label>
              <Form.Control
                type="text"
                value={lokacija}
                onChange={e => setLokacija(e.target.value)}
                
                required
                placeholder='Unesite naziv lokacije'
                style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                className='placeholder-light' 
              />
            </Form.Group>
         

            <Form.Group className='mb-3'>
              <Form.Label>Dodaj sliku</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e)=>{
                  const file = e.target.files[0]
                  if(file){
                    setSlika(file);
                  }
                }}
                style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
              />
            </Form.Group>
            <Button
                    className="btn-pink"
                    size="sm"
                    onClick={() => setShowCenovnik(true)}
                  >
                    + Dodaj cenovnik
                  </Button>
        </Form>
        </fieldset>
        <fieldset className='p-3 mb-4' style={{backgroundColor: "#1F1B36"}}/**stil */>
          <legend className='w-auto px-2'>Kreiranje karata</legend>
              
     
          <Form className="mt-4">
            {karte.map((karta, index) => (
              <fieldset key={index} className="p-3 mb-3" style={{borderStyle:'solid', borderWidth:'1px',borderColor:'#693173', borderRadius:'8px'}}>
                <legend className="fs-6">Karta {index + 1}</legend>
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group controlId={`nazivKarte-${index}`}>
                      <Form.Label>Naziv karte</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Unesite naziv"
                        value={karta.naziv}
                        onChange={(e) => handleKarteChange(index, 'naziv', e.target.value)}
                        required
                        className='placeholder-light' 
                        style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`tipKarte-${index}`}>
                      <Form.Label>Tip karte</Form.Label>
                      <Form.Select 
                        value={karta.tip}
                        onChange={e => handleKarteChange(index, 'tip', e.target.value)}
                        required
                        style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                        >
                          <option>Odaberite tip Karte</option>
                          { tipoviKarata.map(t => (
                            <option key={t} value={t}>{t}</option>
                          )) }
                        </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`cenaKarte-${index}`}>
                      <Form.Label>Cena {'<RSD>'} </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Unesite cenu"
                        value={karta.cena}
                        min={0}
                        onChange={(e) => handleKarteChange(index, 'cena', e.target.value)}
                        className='placeholder-light' 
                        style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`kolicina-${index}`}>
                      <Form.Label>Količina</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        placeholder="Unesite količinu"
                        value={karta.kolicina}
                        onChange={(e) => handleKarteChange(index, 'kolicina', e.target.value)}
                        className='placeholder-light'
                        style={{backgroundColor:'#000A25', color:'white', borderColor:'#E94586'}}
                      />
                    </Form.Group>
                    
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId={`danKarte-${index}`}>
                    
                      <Form.Label>Datum dana</Form.Label>
                      
                      <Form.Select
                        onChange={(e)=>handleKarteChange(index, 'danKarte', e.target.value)}
                      >
                        <option>Odaberi dan</option>
                        <option>Ceo događaj</option>
                        {dani &&(
                          dani.map((dan, index)=>{
                            return <option>{dan.datum}</option>
                          })
                        )

                        }
                      </Form.Select>
                    </Form.Group>
                    
                  </Col>
                </Row>
        </fieldset>
      ))}

        <Button
          variant="success"
          type="button"
          onClick={dodajKartu}
          className="mt-2 btn-add"
          color='#B52956'
          style ={{
            backgroundColor:'#B52956',
            borderColor: "#B52956",
          }}
        >
          Dodaj kartu
        </Button>
        </Form>
        </fieldset>
        <fieldset className='p-3 mb-4' style={{backgroundColor: "#1F1B36"}}/**stil */>
          <legend className='w-auto px-2'>Dodavanje napomena</legend>
          <Form className="mt-4">
            {napomene.map((napomena, index) => (
              <fieldset key={index} className="p-3 mb-3" style={{borderStyle:'solid', borderWidth:'1px',borderColor:'#693173', borderRadius:'8px'}}>
                <legend className="fs-6">Napomena {index + 1}</legend>
                <Row className="mb-3">
                  <Col md={5}>
                    <Form.Group controlId={`sadrzajNapomene-${index}`}>
                      <Form.Label>Sadržaj napomene</Form.Label>
                      <RichTextEditor content={napomene[index].sadrzaj} setContent={(cnt)=>{
                          const noveNapomene =[...napomene]
                          noveNapomene[index].sadrzaj = cnt
                          setNapomene(noveNapomene)
                          
                        }}
                        style = {{ backgroundColor: "#000A25"}}
                        ></RichTextEditor>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group controlId={`oznakeNapomene-${index}`}>
                      <Form.Label>Tip</Form.Label>
                      <Form.Select
                        value={napomena.tip}
                        onChange={(e) => handleNapomeneChange(index, 'tip', e.target.value)}
                        className='placeholder-light'
                        style={{
                          backgroundColor: '#000A25',
                          color: 'white',
                          borderColor: '#E94586'
                        }}
                      >
                        <option value="">Izaberi tip</option>

                        {tipoviNapomena.map((tip, idx) => (
                          <option key={idx} value={tip}>
                            {tip}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                </Row>
        </fieldset>
      ))}

        <Button
          variant="success"
          type="button"
          onClick={dodajNapomenu}
          className="mt-2 btn-add"
          color='#B52956'
          style ={{
            backgroundColor:'#B52956',
            borderColor: "#B52956"
          }}
        >
          Dodaj napomenu
        </Button>
        </Form>

        </fieldset>
        <fieldset className='p-3 mb-4' style={{backgroundColor: "#1F1B36"}}/**stil */>
          <legend className='w-auto px-2'>Uređivanje dana</legend>
            <Col md={12}>
            <h6>Dani događaja</h6>

            {
            Array.isArray(dani) && dani.length === 0 && <div>Unesite validne datume početka i završetka da biste uredili dane.</div>
            }

            {dani && dani.map((dan, index) => (
              <div key={dan.id} className="day-card" style={{borderStyle:'solid', borderWidth:'1px',borderColor:'#693173', borderRadius:'8px'}}> 
                <h6>
                  {dan.nazivLokacije} ({dan.datum})
                </h6>

                
                  <Form.Label>Opis dana</Form.Label>
                  <Form.Group className='mb-3' controlId="opisDogadjaja">
                  <RichTextEditor content={dani[index].opis} setContent={(cnt)=>{
                    const noviDani =[...dani]
                    noviDani[index].opis = cnt
                    setDani(noviDani)
                  }}
                  ></RichTextEditor>
            
                </Form.Group>

                {/* Dugmici za izbor forme */}
                <div className="button-group mb-3">
                  <Button
                    className="btn-pink"
                    size="sm"
                    onClick={() => {
                      openMapForDay(index);
                    }}
                  >
                    + Dodaj područja
                  </Button>

                  <Button
                    className="btn-pink"
                    size="sm"
                    onClick={() => {
                      setTrenutniDanIndex(index);
                      setAktivnaForma('aktivnost');
                    }}
                  >
                    + Dodaj aktivnost
                  </Button>
                  
                  

                  <Button
                    className="btn-pink"
                    size="sm"
                    onClick={() => otvoriMapu(index)}
                  >
                    Uredi mapu
                  </Button>
                </div>

                {/* Forma za unos resursa */}
                {trenutniDanIndex === index && aktivnaForma === 'resurs' && (
                  <div style={{ marginBottom: '15px' }}>
                    <Form.Control
                      type="text"
                      placeholder="Naziv resursa"
                      value={resursUnos.naziv}
                      onChange={(e) =>
                        setResursUnos({ ...resursUnos, naziv: e.target.value })
                      }
                      className="mb-2"
                    />
                    <Form.Control
                      type="text"
                      placeholder="Tip resursa"
                      value={resursUnos.tip}
                      onChange={(e) =>
                        setResursUnos({ ...resursUnos, tip: e.target.value })
                      }
                      className="mb-2"
                    />
                    <Form.Control
                      type="number"
                      placeholder="Količina"
                      value={resursUnos.kolicina}
                      onChange={(e) =>
                        setResursUnos({ ...resursUnos, kolicina: e.target.value })
                      }
                      className="mb-2"
                    />
                    <div className="button-group">
                      <Button
                        className="btn-pink"
                        onClick={() => dodajResursUDan(index)}
                      >
                        Dodaj resurs
                      </Button>{' '}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setTrenutniDanIndex(null);
                          setAktivnaForma(null);
                        }}
                      >
                        Otkaži
                      </Button>
                    </div>
                  </div>
                )}

                {/* Forma za unos aktivnosti */}
                {trenutniDanIndex === index && aktivnaForma === 'aktivnost' && (
                  <div style={{ marginBottom: '15px' }}>
                    <Form.Control
                      type="text"
                      placeholder="Naziv aktivnosti"
                      value={aktivnostUnos.naziv}
                      onChange={(e) =>
                        setAktivnostUnos({ ...aktivnostUnos, naziv: e.target.value })
                      }
                      className="mb-2"
                      style={{backgroundColor:'#1F1B36', color: 'white', borderColor:'#E94586'}}
                    />
                    <Form.Control
                      as="textarea"
                      placeholder="Opis aktivnosti"
                      rows={2}
                      value={aktivnostUnos.opis}
                      onChange={(e) =>
                        setAktivnostUnos({ ...aktivnostUnos, opis: e.target.value })
                      }
                      className="mb-2"
                      style={{backgroundColor:'#1F1B36', color:'white', borderColor:'#E94586'}}
                    />
                    <Row className="mb-2">
                      <Col>
                        <Form.Control
                          type="time"
                          placeholder="Vreme početka"
                          value={aktivnostUnos.vremePocetka}
                          onChange={(e) =>
                            setAktivnostUnos({
                              ...aktivnostUnos,
                              vremePocetka: e.target.value,
                            })
                          }
                          style={{backgroundColor:'#1F1B36', color:'white', borderColor:'#E94586'}}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="time"
                          placeholder="Vreme završetka"
                          value={aktivnostUnos.vremeZavrsetka}
                          onChange={(e) =>
                            setAktivnostUnos({
                              ...aktivnostUnos,
                              vremeZavrsetka: e.target.value,
                            })
                          }
                          style={{backgroundColor:'#1F1B36', color:'white', borderColor:'#E94586'}}
                        />
                      </Col>
                    </Row>
                    <AktivnostForm dani={dani} aktivniDanIndex={trenutniDanIndex} setDani={setDani} trenutnoAktivnost={aktivnostUnos} setAktivnostUnos={setAktivnostUnos}></AktivnostForm>
                    <div className="button-group">
                      <Button
                        className="btn-pink"
                        onClick={() => dodajAktivnostUDan(index)}
                      >
                        Dodaj aktivnost
                      </Button>{' '}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setTrenutniDanIndex(null);
                          setAktivnaForma(null);
                        }}
                      >
                        Otkaži
                      </Button>
                    </div>
                  </div>
                )}

                {/* Prikaz resursa */}
                {/* {dan.resursi.length > 0 && (
                  <>
                    <h6>Resursi:</h6>
                    <ul>
                      {dan.resursi.map((r) => (
                        <li key={r.id}>
                          {`${r.naziv} - ${r.tip} - ${r.kolicina}`}
                        </li>
                      ))}
                    </ul>
                  </>
                )} */}

                {/* Prikaz aktivnosti */}
                {dan.aktivnosti.length > 0 && (
                  <>
                    <h6>Aktivnosti:</h6>
                    <ul>
                      {dan.aktivnosti.map((a) => (
                        <li key={a.id}>
                          <strong>{a.naziv}</strong> ({a.vremePocetka} - {a.vremeZavrsetka})
                          <br />
                          {a.opis}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </Col>
        </fieldset>
         

        <Button className='w-100' style={{backgroundColor:'#693173',borderColor:'#693173'}} onClick={()=>{

        kreirajDogadjaj();
        }}>
        Kreiraj Događaj
      </Button>
      </Container>
      <Modal show={showCenovnik} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{color:'white'}}>Dodaj stavke</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cenovnik onSubmit={handleStavkeSubmit} />
        </Modal.Body>
      </Modal>

      <Modal show={showSuccessModal} onHide={()=> setShowSuccessModal(false)} centered dialogClassName="success-modal">
        <Modal.Header closeButton>
          <Modal.Title>Uspešno kreiran događaj!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Događaj je uspešno kreiran</p>
          <p><strong>Naziv:</strong> {naziv}</p>
          <p><strong>Datum:</strong> {datumPocetka?.toLocaleString()}</p>
          <p><strong>Lokacija:</strong> {lokacija || 'Nepoznata'}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => window.location.reload()}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <MapModal
        show={dayMapModalOpen}
        onClose={handleMapModalClose}
        existingFields={dani[odabraniDanIndexZaMapi]?.fields || []}
      >
        
      </MapModal>
        {
          //Ovde je prethodno ==============================================================================================================
        }

      

      {/* <Modal show={showMapModal} onHide={zatvoriMapu} size='xl' fullscreen="md-down" >
        <Modal.Header closeButton>
          <Modal.Title>
            Uredi mapu za {aktivniDanIndex !== null ? dani[aktivniDanIndex].nazivLokacije : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '100vh', overflowY: 'auto' }}>
          {aktivniDanIndex !== null && (
            <EditMapPage
              //dan={dani[aktivniDanIndex]}
              dani = {dani}
              index = {aktivniDanIndex}
              onClose={zatvoriMapu}
              onSave={(updatedPoints)=>{
                const noviDani = [...dani];
                noviDani[aktivniDanIndex].tacke = updatedPoints;
                setDani(noviDani)
                console.log(noviDani);
              }}
            />
          )}
        </Modal.Body>
      </Modal> */}
    </div>
  );
}

export default CreateEventPage;
