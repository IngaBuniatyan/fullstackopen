import { Link } from 'react-router-dom'

import useBlogStore from '../stores/blogStore'

const UsersView = () => {
  const users = useBlogStore((state) => state.users)

  return (
    <section>
      <p className="eyebrow">Contributors</p>
      <h1>Users</h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>
                    {user.name || user.username}
                  </Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default UsersView
