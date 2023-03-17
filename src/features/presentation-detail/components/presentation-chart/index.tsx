import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import randomColor from "randomcolor";
import "./style.scss";
import { usePresentFeature } from "../../../../common/contexts/present-feature-context";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Chart options
const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        y: {
            ticks: {
                stepSize: 1,
            },
        },
    },
};

const generateRandomColor = () => {
    return randomColor({ format: "rgb", hue: "purple" });
};

interface IChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        maxBarThickness: number;
    }[];
}

const defaultChartData: IChartData = {
    labels: [],
    datasets: [],
};

export default function PresentationChart() {
    const { slideState } = usePresentFeature();
    const [data, setData] = useState<IChartData>(defaultChartData);

    useEffect(() => {
        const labels: string[] = [];
        const values: number[] = [];
        const backgroundColors: string[] = [];
        slideState.options.forEach((item, index) => {
            labels.push(item.value);
            values.push(slideState.result.find((element) => element.key === item.key)?.value || 0);
            try {
                backgroundColors.push(data.datasets[0].backgroundColor[index] || generateRandomColor());
            } catch (err) {
                backgroundColors.push(generateRandomColor());
            }
        });

        setData({
            labels: labels,
            datasets: [
                {
                    label: "Kết quả",
                    data: values,
                    backgroundColor: backgroundColors,
                    maxBarThickness: 100,
                },
            ],
        });
        // eslint-disable-next-line
    }, [slideState]);

    return (
        <div className="presentation-chart__chart-container">
            <Bar options={options} data={data} />
        </div>
    );
}
