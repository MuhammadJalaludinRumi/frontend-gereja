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