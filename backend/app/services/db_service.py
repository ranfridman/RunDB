from typing import List
from app.schemas.db import DBCredentials, DBStructureResponse, DatabaseTreeNodeData

class DBService:
    def validate_credentials(self, uri: str) -> bool:
        """
        Validate database connection credentials via URI.
        """
        # Mock validation
        if "badhost" in uri:
            return False
        
        if not uri:
            return False
        
        return True

    def get_structure(self, uri: str) -> DBStructureResponse:
        """
        Get the structure of the database in a hierarchical tree format suitable for Mantine Tree.
        """
        # Extract a name from URI for display purposes (mock logic)
        db_name = uri.split('/')[-1] if '/' in uri else "Database"
        if '?' in db_name:
            db_name = db_name.split('?')[0]

        # First validate the connection
        is_valid = self.validate_credentials(uri)
        if not is_valid:
            return DBStructureResponse(
                success=False,
                dbName=db_name,
                data=[]
            )
        
        # Mock hierarchical structure: database -> table -> column
        mock_tree = [
            DatabaseTreeNodeData(
                label=db_name,
                value=db_name,
                type='database',
                children=[
                    DatabaseTreeNodeData(
                        label='users',
                        value=f"{db_name}.users",
                        type='table',
                        children=[
                            DatabaseTreeNodeData(label='id', value=f"{db_name}.users.id", type='column'),
                            DatabaseTreeNodeData(label='username', value=f"{db_name}.users.username", type='column'),
                            DatabaseTreeNodeData(label='email', value=f"{db_name}.users.email", type='column'),
                            DatabaseTreeNodeData(label='created_at', value=f"{db_name}.users.created_at", type='column'),
                        ]
                    ),
                    DatabaseTreeNodeData(
                        label='orders',
                        value=f"{db_name}.orders",
                        type='table',
                        children=[
                            DatabaseTreeNodeData(label='id', value=f"{db_name}.orders.id", type='column'),
                            DatabaseTreeNodeData(label='user_id', value=f"{db_name}.orders.user_id", type='column'),
                            DatabaseTreeNodeData(label='amount', value=f"{db_name}.orders.amount", type='column'),
                            DatabaseTreeNodeData(label='status', value=f"{db_name}.orders.status", type='column'),
                        ]
                    ),
                    DatabaseTreeNodeData(
                        label='products',
                        value=f"{db_name}.products",
                        type='table',
                        children=[
                            DatabaseTreeNodeData(label='id', value=f"{db_name}.products.id", type='column'),
                            DatabaseTreeNodeData(label='name', value=f"{db_name}.products.name", type='column'),
                            DatabaseTreeNodeData(label='price', value=f"{db_name}.products.price", type='column'),
                        ]
                    )
                ]
            )
        ]
        
        return DBStructureResponse(
            success=True,
            dbName=db_name,
            data=mock_tree
        )

db_service = DBService()
