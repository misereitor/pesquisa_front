import Company from '@/components/company/company';
import { getAllCompany } from '@/service/company-service';

export default async function Empresas() {
  const companies = await getAllCompany();
  return <Company companies={companies} />;
}
