#!/bin/bash

echo "Updating remaining Bootstrap imports to Material-UI..."

# Update SearchScreen
sed -i '' 's/import { Button, Col, Row } from '\''react-bootstrap'\'';/import { Button, Grid, Container, Typography, Box } from '\''@mui\/material'\'';/g' frontend/src/screens/SearchScreen.js

# Update UserEditScreen  
sed -i '' 's/import { Button, Container, Form } from '\''react-bootstrap'\'';/import { Button, Container, TextField, Typography, Box, Paper } from '\''@mui\/material'\'';/g' frontend/src/screens/UserEditScreen.js

# Update UserListScreen
sed -i '' 's/import { Button } from '\''react-bootstrap'\'';/import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container } from '\''@mui\/material'\'';/g' frontend/src/screens/UserListScreen.js

# Update OrderListScreen
sed -i '' 's/import { Button } from '\''react-bootstrap'\'';/import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container } from '\''@mui\/material'\'';/g' frontend/src/screens/OrderListScreen.js

# Update ProductListScreen
sed -i '' 's/import { Row, Col, Button } from '\''react-bootstrap'\'';/import { Grid, Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '\''@mui\/material'\'';/g' frontend/src/screens/ProductListScreen.js

echo "Basic import updates completed. Manual JSX updates may still be needed for complex components."