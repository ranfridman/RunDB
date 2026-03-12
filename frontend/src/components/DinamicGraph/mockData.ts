export const data = Array.from({ length: 40 }, (_, i) => {
    const day = i + 1;
    const date = new Date(2024, 0, day);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

    return {
        date: dateStr,
        Technology: Math.floor(2000 + Math.random() * 8000),
        Healthcare: Math.floor(1500 + Math.random() * 5000),
        Finance: Math.floor(1000 + Math.random() * 6000),
        Logistics: Math.floor(2000 + Math.random() * 4000),
        Energy: Math.floor(1800 + Math.random() * 7000),
        Retail: Math.floor(2500 + Math.random() * 7500),
        AI: Math.floor(3000 + Math.random() * 9000),
        Cyber: Math.floor(4000 + Math.random() * 6000),
        FinTech: Math.floor(2000 + Math.random() * 5500),
        Ecommerce: Math.floor(3500 + Math.random() * 8500),
        Gaming: Math.floor(1000 + Math.random() * 4500),
        SaaS: Math.floor(5000 + Math.random() * 5000),
        Cloud: Math.floor(4500 + Math.random() * 6000),
        Mobile: Math.floor(1200 + Math.random() * 3800),
        Infrastructure: Math.floor(3000 + Math.random() * 4000),
    };
});
