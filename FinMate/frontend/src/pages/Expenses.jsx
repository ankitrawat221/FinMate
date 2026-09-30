import ResourcePage from "./ResourcePage";

export default function Expenses() {
  return (
    <ResourcePage
      resource="expenses"
      title="Expenses"
      subtitle="Track spending and understand where your money goes."
      fields={["amount", "category", "date", "description"]}
    />
  );
}
