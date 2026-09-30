import ResourcePage from "./ResourcePage";

export default function Bills() {
  return (
    <ResourcePage
      resource="bills"
      title="Bills & Reminders"
      subtitle="Stay ahead of upcoming payments and due dates."
      fields={["name", "amount", "dueDate", "category"]}
    />
  );
}
