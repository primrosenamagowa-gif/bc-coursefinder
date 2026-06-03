import { useState } from "react";

export default function APSCalculator() {

  const subjectsList = [
    "Mathematics",
    "Mathematics Literacy",
    "English Home Language",
    "English First Additional Language",
    "Afrikaans First Additional Languge",
    "IsiZulu Home Language",
    "IsiXhosa Home Language",
    "Sesotho Home Language",
    "Setswana Home Language",
    "Sepedi Home Language",
    "Swati Home Language",
    "Ndebele Home Language",
    "Vhenda Home Language",
    "Tshonga Home Language",
    "Physical Sciences",
    "Life Sciences",
    "Geography",
    "History",
    "Accounting",
    "Business Studies",
    "Economics",
    "Information Technology",
    "Computer Applications Technology",
    "Consumer Studies",
    "Tourism",
    "Life Orientation"
  ];

  const [subjects, setSubjects] = useState(
    Array(7).fill({
      subject: "",
      percentage: ""
    })
  );

  const [aps, setAPS] = useState(null);

  const handleChange = (index, field, value) => {

    const updated = [...subjects];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setSubjects(updated);
  };

  const calculateAPS = () => {

    let total = 0;

    subjects.forEach((sub) => {

      const score = parseInt(sub.percentage);

      if (isNaN(score)) return;

      if (score >= 80) total += 7;
      else if (score >= 70) total += 6;
      else if (score >= 60) total += 5;
      else if (score >= 50) total += 4;
      else if (score >= 40) total += 3;
      else if (score >= 30) total += 2;
      else total += 1;

    });

    setAPS(total);
  };

  return (

    <div className="aps-container">

      <h2>APS Calculator</h2>

      {subjects.map((sub, index) => (

        <div
          key={index}
          className="aps-subject"
        >

          <select
            value={sub.subject}
            onChange={(e) =>
              handleChange(
                index,
                "subject",
                e.target.value
              )
            }
          >

            <option value="">
              Select Subject
            </option>

            {subjectsList.map((subject) => (

              <option
                key={subject}
                value={subject}
              >
                {subject}
              </option>

            ))}

          </select>

          <input
            type="number"
            placeholder="Percentage"
            min="0"
            max="100"
            value={sub.percentage}
            onChange={(e) =>
              handleChange(
                index,
                "percentage",
                e.target.value
              )
            }
          />

        </div>

      ))}

      <button onClick={calculateAPS}>
        Calculate APS
      </button>

      {aps !== null && (
        <h3>Your APS Score: {aps}</h3>
      )}

    </div>
  );
}