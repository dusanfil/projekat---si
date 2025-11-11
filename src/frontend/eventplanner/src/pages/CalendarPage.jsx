import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarPage.css";
import axios from "axios";
import config from '../config';
function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsForDay, setEventsForDay] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const organizatorId = localStorage.getItem("organizatorId");
    axios
      .get(config.API_BASE_URL +"api/dogadjaj/prikaz", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const mojiDogadjaji = res.data.filter((e) =>
          (e.organizator || e.Organizator)?.trim() === organizatorId?.trim()
        );
        setEvents(mojiDogadjaji);
      });
  }, []);

  useEffect(() => {
    const d = selectedDate;
    const dayEvents = events.filter((e) => {
      const eventStart = new Date(e.datumPocetka);
      const eventEnd = new Date(e.datumKraja || e.datumPocetka);
      return (
        d >= new Date(eventStart.setHours(0, 0, 0, 0)) &&
        d <= new Date(eventEnd.setHours(23, 59, 59, 999))
      );
    });
    setEventsForDay(dayEvents);
  }, [selectedDate, events]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasEvent = events.some((e) => {
        const start = new Date(e.datumPocetka);
        const end = new Date(e.datumKraja || e.datumPocetka);
        return (
          date >= new Date(start.setHours(0, 0, 0, 0)) &&
          date <= new Date(end.setHours(23, 59, 59, 999))
        );
      });
      if (hasEvent) {
        // Tacka ispod broja
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ height: 0 }}></span>
            <span className="calendar-dot"></span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="calendarpage-root">
      <div className="calendarpage-content">
        <div className="calendarpage-title-centered">
          Kalendar događaja
        </div>
        <div className="calendarpage-main">
          <div className="calendarpage-calendar-wrapper">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              calendarType="iso8601"
              locale="sr-Latn-RS" 
            />
          </div>
          <div className="calendarpage-list">
            <h4>
              Događaji za:{" "}
              {selectedDate.toLocaleDateString("sr-Latn-RS", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h4>
            {eventsForDay.length === 0 ? (
              <div className="calendarpage-noevents">Nema događaja za ovaj dan.</div>
            ) : (
              <ul>
                {eventsForDay.map((e) => {
                  const start = new Date(e.datumPocetka);
                  const end = new Date(e.datumKraja || e.datumPocetka);
                  const today = new Date(selectedDate);

                  // Normalize datume na ponoć
                  start.setHours(0,0,0,0);
                  end.setHours(0,0,0,0);
                  today.setHours(0,0,0,0);

                  const danTrajanja = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
                  const ukupnoDana = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

            
                  return (
                    <li
                      key={e.id}
                      className="calendarpage-event"
                      onClick={() => window.location.href = `/details/${e.id}`}
                    >
                      <div className="calendarpage-title">{e.naziv}</div>
                      <div className="calendarpage-info">
                        {e.lokacija && (
                          <span>
                            <b>Lokacija:</b> {e.lokacija}
                          </span>
                        )}
                      </div>
                      <div className="calendarpage-info">
                        <span>
                          <b>Početak:</b> {new Date(e.datumPocetka).toLocaleDateString("sr-Latn-RS")}
                        </span>
                        <span>
                          <b>Kraj:</b> {e.datumKraja
                            ? new Date(e.datumKraja).toLocaleDateString("sr-Latn-RS")
                            : "-"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;