import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api, verifyToken } from "../utils/api";
import { dayInMilliseconds } from "../utils/constants";

export default function Heatmap() {
  const [sessions, setSessions] = useState([]);

  const [tooltip, setTooltip] = useState(false);
  const [tooltipDateInfo, setTooltipDateInfo] = useState("");
  const [tooltipReviewInfo, setTooltipReviewInfo] = useState(0);

  const [lastSessionDuration, setLastSessionDuration] = useState(0);
  const [lastSessionReviews, setLastSessionReviews] = useState(0);

  const [lastRetentionRate, setLastRetentionRate] = useState("");

  useEffect(() => {
    const userId = verifyToken();

    api
      .post("users/user-info", {
        id: userId,
      })
      .then((res) => {
        console.log(res.data);
        //get start date set by the user
      });

    api
      .post("sessions/user-sessions", {
        userId: userId,
      })
      .then((res) => {
        let hashMap = {};
        let formattedSessions = [];
        let newestDate = Date.now();

        const numberOfDaysShown = 30;

        if (res.data[0]) {
          const dateNewestToOldest = res.data.sort((a, b) => {
            return b.endTime - a.endTime;
          });

          setLastSessionDuration(
            dateNewestToOldest[0].endTime - dateNewestToOldest[0].startTime
          );

          setLastSessionReviews(dateNewestToOldest[0].numberOfCardsReviewed);

          if (dateNewestToOldest[0].numberOfMatureCardsReviewed > 0) {
            setLastRetentionRate(
              `${
                (1 -
                  dateNewestToOldest[0].numberOfFailsOnMatureCards /
                    dateNewestToOldest[0].numberOfMatureCardsReviewed) *
                100
              }%`
            );
          } else {
            setLastRetentionRate("N/D");
          }

          dateNewestToOldest.reverse().map((item) => {
            const date = new Date(item.endTime).toLocaleDateString("pt-br");

            if (hashMap.hasOwnProperty(date)) {
              hashMap[date].numberOfCardsReviewed += item.numberOfCardsReviewed;
            } else {
              hashMap[date] = {
                numberOfCardsReviewed: item.numberOfCardsReviewed,
                date: item.endTime,
              };
            }
          });

          formattedSessions = Object.values(hashMap).map((item) => {
            return item;
          });

          newestDate = dateNewestToOldest.reverse()[0].endTime;
        }

        let emptyElementDate;

        while (formattedSessions.length < numberOfDaysShown) {
          emptyElementDate = newestDate + dayInMilliseconds;
          newestDate = emptyElementDate;

          formattedSessions.push({
            date: emptyElementDate,
            numberOfCardsReviewed: 0,
          });
        }

        setSessions(formattedSessions);
      });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-4 relative mx-4">
      <label className="">{`Você revisou ${lastSessionReviews} carta(s) em sua última sessão, com uma duração de ${new Date(
        lastSessionDuration
      )
        .toISOString()
        .slice(11, 19)}.`}</label>
      <label>{`Taxa de retenção: ${lastRetentionRate}`}</label>
      <div className="inline-grid grid-cols-8 gap-2 bg-gray-100 my-4 p-2 rounded-lg mx-2 sm:w-1/2">
        {sessions.map((item, i) => {
          return (
            //color changes with the number of cards reviewed
            <div
              className={`h-1 w-1 p-2 rounded ${
                item.numberOfCardsReviewed == 0
                  ? "bg-gray-400"
                  : item.numberOfCardsReviewed > 4
                  ? "bg-green-300"
                  : "bg-green-200"
              }`}
              key={i}
              onMouseEnter={() => {
                const formattedDate = new Date(item.date).toLocaleDateString(
                  "pt-br"
                );

                setTooltip(true);
                setTooltipDateInfo(formattedDate);
                setTooltipReviewInfo(item.numberOfCardsReviewed);
              }}
              onMouseLeave={() => setTooltip(false)}
            ></div>
          );
        })}
      </div>
      {tooltip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-100 absolute p-4 rounded-lg mt-56 hidden sm:inline-block"
        >{`${tooltipReviewInfo} 
        cartas revisadas em ${tooltipDateInfo}`}</motion.div>
      )}
    </div>
  );
}
