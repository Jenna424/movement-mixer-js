class User < ApplicationRecord
  enum role: { unassigned: 0, client: 1, trainer: 2, admin: 3 }
end