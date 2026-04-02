interface ReflectionForm {
  id?: number,
  date_post: string,
  title: string,
  content: string,
  image?: string,
  status: number,
}

interface NewsForm {
  id?: number,
  date_post: string,
  title: string,
  content: string,
  thumbnail: string,
  image?: string,
  status: number,
}

interface UserForm {
  id?: number
  username: string
  password?: string
  name: string
  is_active: boolean
  role_id: number
}

interface AclForm {
  name: string
}

interface RoleForm {
  organization_id: number
  name: string
}

interface RuleForm {
  role_id: number
  acl_id: number
  permission: boolean
}

interface InvoiceForm {
  organization_id: number
  date: string
  current_expiry: string
  new_expiry: string
  total: number
}

interface LicenseForm {
  name: string
  price: number
}

interface ProvinceForm {
  name: string
}

interface OrganizationForm {
  name?: string
  abbreviation?: string
  address?: string
  city?: string | number
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  group_id?: string | number
  website?: string
  logo?: File | string
  founded?: string
  legal?: string
}

interface GroupForm {
  name?: string
  address?: string
  city?: string | number
  phone?: string
  email?: string
  website?: string
  logo?: File | string
  founded?: string
  legal?: string
}