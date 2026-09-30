import ResourcePage from "./ResourcePage";

export default function AutoPay() {
  return (
    <ResourcePage
      resource="autopay"
      title="AutoPay"
      subtitle="Track recurring payments without moving money."
      fields={["name", "amount", "frequency", "nextPaymentDate", "category"]}
    />
  );
}
