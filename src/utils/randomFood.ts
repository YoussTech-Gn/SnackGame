const randomFoodWorklet = (xMax: number, yMax: number) => {
  "worklet";
  // توليد عشوائي آمن داخل الـ Worklet
  return {
    x: Math.floor(Math.random() * xMax),
    y: Math.floor(Math.random() * yMax),
  };
};
export { randomFoodWorklet };
