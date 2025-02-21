import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Section from "../../Components/Section";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';

// Componente TabPanel para o conteúdo de cada aba
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function DataTableWithTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({
    columns: [],
    rows: []
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Definição das diferentes tabelas
  const tables = [
    { id: 1, label: 'Países', endpoint: '/api/countries' },
    { id: 2, label: 'Empresas', endpoint: '/api/companies' },
    { id: 3, label: 'Produtos', endpoint: '/api/products' }
  ];

  // Função para buscar dados da API
  const fetchTableData = async (endpoint) => {
    setLoading(true);
    try {
      // Simular chamada à API - substitua por sua chamada real
      // const response = await fetch(endpoint);
      // const data = await response.json();
      
      // Dados simulados - substitua pelos dados da sua API
      const mockData = {
        columns: [
          { id: 'name', label: 'Nome', minWidth: 170 },
          { id: 'code', label: 'Código', minWidth: 100 },
          {
            id: 'population',
            label: 'População',
            minWidth: 170,
            align: 'right',
            format: (value) => value.toLocaleString('pt-BR'),
          },
        ],
        rows: [
          { name: 'Brasil', code: 'BR', population: 214000000 },
          { name: 'Estados Unidos', code: 'US', population: 332000000 },
          // Adicione mais dados conforme necessário
        ]
      };

      setTableData(mockData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(tables[activeTab].endpoint);
  }, [activeTab]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  // Componentes de linha para mobile e desktop
  const MobileRow = ({ row }) => (
    <TableRow 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        borderBottom: 1,
        borderColor: 'divider',
        '&:nth-of-type(even)': {
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      {tableData.columns.map((column) => {
        const value = row[column.id];
        return (
          <TableCell 
            key={column.id} 
            sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: 'none',
              py: 1.5
            }}
          >
            <Typography component="span" sx={{ fontWeight: 'bold', mr: 2 }}>
              {column.label}:
            </Typography>
            <Typography component="span">
              {column.format && typeof value === 'number'
                ? column.format(value)
                : value}
            </Typography>
          </TableCell>
        );
      })}
    </TableRow>
  );

  const DesktopRow = ({ row }) => (
    <TableRow hover>
      {tableData.columns.map((column) => {
        const value = row[column.id];
        return (
          <TableCell 
            key={column.id} 
            align={column.align}
          >
            {column.format && typeof value === 'number'
              ? column.format(value)
              : value}
          </TableCell>
        );
      })}
    </TableRow>
  );

  return (
    <Section
      crosses
      crossesOffset="translate-y"
      customPaddings
      className="md:px-[1.3rem] lg:px-[1.9rem] xl:px-[2.5rem] relative scroll-mt-20"
      id="local"
    >
      <Box sx={{ width: '100%' }}>
        {/* Título */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Banco de Dados
        </Typography>

        {/* Tabs */}
        <Paper sx={{ mb: 2, borderRadius: '8px 8px 0 0' }}>
          <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
              }
            }}
          >
            {tables.map((table) => (
              <Tab key={table.id} label={table.label} />
            ))}
          </Tabs>
        </Paper>

        {/* Conteúdo da tabela */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  {!isMobile && (
                    <TableHead>
                      <TableRow>
                        {tableData.columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{ 
                              minWidth: column.minWidth,
                              backgroundColor: '#1976d2',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                  )}
                  <TableBody>
                    {tableData.rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        isMobile ? (
                          <MobileRow key={index} row={row} />
                        ) : (
                          <DesktopRow key={index} row={row} />
                        )
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={tableData.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Linhas por página"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}-${to} de ${count}`
                }
              />
            </>
          )}
        </Paper>
      </Box>
    </Section>
  );
}