from typing import List
from app.schemas.db import DBCredentials, DBStructureResponse, DatabaseTreeNodeData

class DBService:
    def validate_credentials(self, credentials: DBCredentials) -> bool:
        """
        Validate database connection credentials.
        """
        # Mock validation
        if credentials.host == "badhost":
            return False
        
        if not credentials.password:
            return False
        
        return True

    def get_structure(self, credentials: DBCredentials) -> DBStructureResponse:
        """
        Get the structure of the database in a hierarchical tree format suitable for Mantine Tree.
        """
        # First validate the connection
        is_valid = self.validate_credentials(credentials)
        if not is_valid:
            return DBStructureResponse(
                success=False,
                dbName=credentials.database,
                data=[]
            )
        
        # Mock hierarchical structure: database -> table -> column
        mock_tree = [
            DatabaseTreeNodeData(
                label=credentials.database,
                value=credentials.database,
                type='database',
                children=[
                    DatabaseTreeNodeData(
                        label='users',
                        value=f"{credentials.database}.users",
                        type='table',
                        children=[
                            DatabaseTreeNodeData(label='id', value=f"{credentials.database}.users.id", type='column'),
                            DatabaseTreeNodeData(label='username', value=f"{credentials.database}.users.username", type='column'),
                            DatabaseTreeNodeData(label='email', value=f"{credentials.database}.users.email", type='column'),
                            DatabaseTreeNodeData(label='created_at', value=f"{credentials.database}.users.created_at", type='column'),
                        ]
                    ),
                    DatabaseTreeNodeData(
                        label='orders',
                        value=f"{credentials.database}.orders",
                        type='table',
                        children=[
                            DatabaseTreeNodeData(label='id', value=f"{credentials.database}.orders.id", type='column'),
                            DatabaseTreeNodeData(label='user_id', value=f"{credentials.database}.orders.user_id", type='column'),
                            DatabaseTreeNodeData(label='amount', value=f"{credentials.database}.orders.amount", type='column'),
                            DatabaseTreeNodeData(label='status', value=f"{credentials.database}.orders.status", type='column'),
                        ]
                    ),
                    DatabaseTreeNodeData(
                        label='products',
                        value=f"{credentials.database}.products",
                        type='table',
                        children=[
                            DatabaseTreeNodeData(label='id', value=f"{credentials.database}.products.id", type='column'),
                            DatabaseTreeNodeData(label='name', value=f"{credentials.database}.products.name", type='column'),
                            DatabaseTreeNodeData(label='price', value=f"{credentials.database}.products.price", type='column'),
                        ]
                    )
                ]
            )
        ]
        
        return DBStructureResponse(
            success=True,
            dbName=credentials.database,
            data=mock_tree
        )

db_service = DBService()
