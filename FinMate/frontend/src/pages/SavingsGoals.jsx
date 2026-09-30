import ResourcePage from "./ResourcePage";

export default function SavingsGoals() {
  return (
    <ResourcePage
      resource="goals"
      title="Savings Goals"
      subtitle="Turn meaningful goals into plans you can see."
      fields={[
        "name",
        "targetAmount",
        "currentAmount",
        "targetDate",
        "description",
      ]}
    />
  );
}
